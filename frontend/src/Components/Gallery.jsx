import React, { useEffect, useMemo, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaHeart, FaImages, FaRegHeart, FaTags, FaUser } from "react-icons/fa";
import { FiDownload, FiRefreshCw, FiSearch } from "react-icons/fi";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import ImageWithSkeleton from "./ui/ImageWithSkeleton";

const getStoredUserId = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser);
    return (
      parsedUser?._id?.toString() ||
      parsedUser?.googleId?.toString() ||
      parsedUser?.githubId?.toString() ||
      parsedUser?.discordId?.toString() ||
      null
    );
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

const getImageCategories = (image) => {
  if (Array.isArray(image?.category)) return image.category;
  return image?.category ? [image.category] : [];
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([{ name: "All", count: 0 }]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState("uploads");
  const location = useLocation();
  const navigate = useNavigate();

  const userId = useMemo(() => getStoredUserId(), []);
  const API_BASE = import.meta.env.VITE_API_URL;
  const resolveAssetUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_BASE}${url}`;
  };
  const fallbackToOriginal = (event, imageUrl) => {
    const originalUrl = resolveAssetUrl(imageUrl);

    if (event.currentTarget.src !== originalUrl) {
      event.currentTarget.src = originalUrl;
    }
  };

  const fetchImages = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const baseUrl = `${API_BASE}/api/gallery`;
      const url = userId ? `${baseUrl}?userId=${encodeURIComponent(userId)}` : baseUrl;
      const response = await axios.get(url);
      const data = response.data;

      setImages(data.images || []);
      setSource(data.source || "uploads");

      if (!data.images?.length) {
        setMessage("No images found.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setMessage("Failed to load images.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.imageFromLiked) {
      setSelectedImage(location.state.imageFromLiked);
    }
  }, [location.state]);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const imageIdFromURL = params.get("id");

    if (imageIdFromURL) {
      const image = images.find((img) => img._id === imageIdFromURL);
      if (image) setSelectedImage(image);
    }
  }, [location.search, images]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/uploads/categories`);
        const data = await response.json();

        if (data.categories) {
          const categoryArray = Object.entries(data.categories)
            .filter(([name]) => name !== "All")
            .map(([name, count]) => ({ name, count }));

          setCategories([{ name: "All", count: images.length }, ...categoryArray]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [images]);

  useEffect(() => {
    if (selectedImage?._id) {
      fetchLikeData(selectedImage._id);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(() => setFeedback(""), 2200);
    return () => clearTimeout(timer);
  }, [feedback]);

  const fetchLikeData = async (imageId) => {
    if (!userId) return;

    try {
      const response = await fetch(`${API_BASE}/api/likes/count/${imageId}?userId=${userId}`);
      const data = await response.json();
      setLikeCount(data.likeCount);
      setLiked(data.userLiked);
    } catch (error) {
      console.error("Error fetching like data:", error);
    }
  };

  const logUserAction = async (imageId, action) => {
    if (!userId || !imageId || !action) return;

    try {
      await fetch(`${API_BASE}/api/clicks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, imageId, action }),
      });
    } catch (error) {
      console.error("Error logging gallery action:", error);
    }
  };

  const handleLikeToggle = async () => {
    if (!userId) {
      setFeedback("Log in to like artworks.");
      return;
    }

    if (!selectedImage?._id) return;

    try {
      const response = await fetch(`${API_BASE}/api/likes/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, imageId: selectedImage._id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to toggle like");

      setLiked(data.liked);
      setLikeCount(data.likeCount);
      await logUserAction(selectedImage._id, "likes");
    } catch (error) {
      console.error("Error toggling like:", error);
      setFeedback("Could not update like.");
    }
  };

  const handleDownload = async (imageSrc, title, imageId) => {
    try {
      const response = await fetch(imageSrc);
      if (!response.ok) throw new Error("Download request failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = title || "aoie-artwork.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      await logUserAction(imageId, "downloads");
    } catch (error) {
      console.error("Download error:", error);
      setFeedback("Download failed.");
    }
  };

  const handleShare = async (imageId) => {
    const shareableLink = `${window.location.origin}/gallery?id=${imageId}`;

    try {
      await navigator.clipboard.writeText(shareableLink);
      setFeedback("Link copied.");
      await logUserAction(imageId, "shares");
    } catch (error) {
      console.error("Share error:", error);
      setFeedback("Could not copy link.");
    }
  };

  const filteredImages = useMemo(() => {
    if (selectedCategory === "All") return images;
    return images.filter((img) => getImageCategories(img).includes(selectedCategory));
  }, [images, selectedCategory]);

  const galleryModeLabel = source === "reccom" || source === "reccom-generated"
    ? "Personalized"
    : "Latest";

  const recommendedImages = useMemo(() => {
    if (!selectedImage) return [];
    const selectedCategories = getImageCategories(selectedImage);

    return images
      .filter((img) => img._id !== selectedImage._id)
      .sort((a, b) => {
        const aScore = getImageCategories(a).filter((cat) => selectedCategories.includes(cat)).length;
        const bScore = getImageCategories(b).filter((cat) => selectedCategories.includes(cat)).length;
        return bScore - aScore;
      })
      .slice(0, 12);
  }, [images, selectedImage]);

  const openModal = async (image) => {
    setSelectedImage(image);
    navigate(`/gallery?id=${image._id}`);
    await logUserAction(image._id, "clicks");
  };

  const closeModal = () => {
    setSelectedImage(null);
    navigate("/gallery");
  };

  return (
    <>
      <Helmet>
        <title>Gallery | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Explore our exclusive collection of stunning artworks in the gallery." />
        <meta property="og:title" content="Gallery | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Explore our exclusive collection of stunning artworks in the gallery." />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="min-h-screen bg-black text-[#E5E7EB]">
        <section className="border-b border-blue-500/20 bg-[#050A14] pt-28">
          <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-200">
                  <FaImages className="text-blue-300" />
                  {galleryModeLabel} gallery
                </div>
                <h1 className="text-4xl font-bold tracking-normal text-white sm:text-5xl">
                  Art Gallery
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                  Browse original AI artworks ranked by your activity, recent uploads, and category discovery.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-lg border border-slate-700/70 bg-slate-950/70 p-3 text-center">
                <div className="min-w-20">
                  <p className="text-2xl font-semibold text-white">{images.length}</p>
                  <p className="text-xs uppercase text-slate-400">Ranked</p>
                </div>
                <div className="min-w-20 border-x border-slate-700/70 px-3">
                  <p className="text-2xl font-semibold text-white">{categories.length}</p>
                  <p className="text-xs uppercase text-slate-400">Tags</p>
                </div>
                <div className="min-w-20">
                  <p className="text-2xl font-semibold text-white">{filteredImages.length}</p>
                  <p className="text-xs uppercase text-slate-400">Shown</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:overflow-visible lg:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      selectedCategory === cat.name
                        ? "border-blue-400 bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                        : "border-slate-700 bg-slate-900 text-slate-300 hover:border-blue-400/70 hover:text-white"
                    }`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    {cat.name} <span className="text-xs opacity-75">({cat.count})</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={fetchImages}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-blue-400 hover:text-white"
              >
                <FiRefreshCw />
                Refresh
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {feedback && (
            <div className="fixed right-4 top-24 z-[60] rounded-md border border-blue-400/30 bg-slate-950 px-4 py-3 text-sm text-blue-100 shadow-2xl">
              {feedback}
            </div>
          )}

          {message && !isLoading && (
            <div className="mb-6 rounded-lg border border-slate-700 bg-slate-950 p-5 text-center text-slate-300">
              {message}
            </div>
          )}

          {isLoading ? (
            <div className="columns-2 gap-3 space-y-3 md:columns-3 lg:columns-4 lg:gap-4 lg:space-y-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className={`mb-3 break-inside-avoid rounded-lg border border-slate-800 ${
                    index % 3 === 0 ? "h-72" : index % 3 === 1 ? "h-56" : "h-80"
                  } animate-shimmer`}
                />
              ))}
            </div>
          ) : (
            <div className="columns-2 gap-3 space-y-3 md:columns-3 lg:columns-4 lg:gap-4 lg:space-y-4">
              {filteredImages.map((image) => (
                <article
                  key={image._id}
                  className="group mb-3 break-inside-avoid overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-xl shadow-black/30 transition hover:border-blue-400/60"
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => openModal(image)}
                  >
                    <div className="relative">
                      <ImageWithSkeleton
                        src={resolveAssetUrl(image.thumbnailUrl || image.imageUrl)}
                        alt={image.title}
                        imgClassName="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        onError={(event) => fallbackToOriginal(event, image.imageUrl)}
                        shimmerType="dark"
                      />
                      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/35 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                        <h2 className="line-clamp-2 text-base font-semibold text-white">{image.title}</h2>
                        <p className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                          <FaUser className="text-blue-300" />
                          {image.author || "Unknown artist"}
                        </p>
                      </div>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          )}

          {!isLoading && filteredImages.length === 0 && !message && (
            <div className="rounded-lg border border-slate-700 bg-slate-950 p-10 text-center">
              <FiSearch className="mx-auto mb-4 text-3xl text-blue-300" />
              <p className="text-lg font-semibold text-white">No artworks in this category</p>
              <button
                type="button"
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
                onClick={() => setSelectedCategory("All")}
              >
                View all
              </button>
            </div>
          )}
        </section>

        {selectedImage && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 text-[#D1D5DB]">
            <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
              <div className="flex min-h-[60vh] items-center justify-center">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="max-h-[82vh] w-full rounded-lg object-contain"
                />
              </div>

              <aside className="self-start rounded-lg border border-slate-800 bg-[#07101F] p-5 shadow-2xl">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                    Artwork details
                  </span>
                  <button
                    type="button"
                    className="rounded-full bg-slate-900 p-2 text-slate-200 transition hover:bg-slate-800 hover:text-white"
                    onClick={closeModal}
                    aria-label="Close artwork preview"
                  >
                    <CgClose />
                  </button>
                </div>

                <h2 className="text-2xl font-semibold text-white">{selectedImage.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{selectedImage.description}</p>
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                  <FaUser className="text-blue-300" />
                  {selectedImage.author || "Unknown artist"}
                </p>

                {getImageCategories(selectedImage).length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {getImageCategories(selectedImage).map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300"
                      >
                        <FaTags className="text-blue-300" />
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-950 text-sm text-slate-200 transition hover:border-red-400 hover:text-white"
                    onClick={handleLikeToggle}
                  >
                    {liked ? <FaHeart className="text-xl text-red-500" /> : <FaRegHeart className="text-xl" />}
                    {likeCount}
                  </button>
                  <button
                    type="button"
                    className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-950 text-sm text-slate-200 transition hover:border-blue-400 hover:text-white"
                    onClick={() => handleShare(selectedImage._id)}
                  >
                    <PiPaperPlaneTiltBold className="text-xl" />
                    Share
                  </button>
                  <button
                    type="button"
                    className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-950 text-sm text-slate-200 transition hover:border-green-400 hover:text-white"
                    onClick={() => handleDownload(selectedImage.imageUrl, selectedImage.title, selectedImage._id)}
                  >
                    <FiDownload className="text-xl" />
                    Save
                  </button>
                </div>

                {recommendedImages.length > 0 && (
                  <div className="mt-7">
                    <h3 className="mb-3 text-sm font-semibold uppercase text-slate-400">More like this</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {recommendedImages.map((img) => (
                        <button
                          key={img._id}
                          type="button"
                          className="aspect-square overflow-hidden rounded-md border border-slate-800 bg-slate-900 transition hover:border-blue-400"
                          onClick={() => openModal(img)}
                        >
                          <ImageWithSkeleton
                            src={resolveAssetUrl(img.thumbnailUrl || img.imageUrl)}
                            alt={img.title}
                            className="h-full w-full"
                            imgClassName="h-full w-full object-cover"
                            onError={(event) => fallbackToOriginal(event, img.imageUrl)}
                            shimmerType="dark"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Gallery;
