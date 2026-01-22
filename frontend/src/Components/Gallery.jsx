import React, { useState, useEffect, useRef } from "react";
import { CgClose } from "react-icons/cg";
import { FaHeart, FaRegHeart, FaTags } from "react-icons/fa";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { FiDownload } from "react-icons/fi";
import { useLocation } from "react-router-dom"; // import for handling URL params
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Helmet } from 'react-helmet-async';

const Gallery = () => {
  const [images, setImages] = useState([]); // Fetch from MongoDB
  const [selectedImage, setSelectedImage] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation(); // Access URL parameters
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // 🔥 Store category list
  const [selectedCategory, setSelectedCategory] = useState("All"); // 🔥 Default: Show all images
  const storedUser = localStorage.getItem("user");


  // This will run once when the component mounts
  useEffect(() => {
    if (location.state?.imageFromLiked) {
      const img = location.state.imageFromLiked;
      setSelectedImage(img);
    }
  }, [location.state]);

  useEffect(() => {
    if (selectedImage?._id) {
      fetchLikeData(selectedImage._id);
    }
  }, [selectedImage]);

  const [isMultiRow, setIsMultiRow] = useState(false); //when more than 2 row  for category
  const containerRef = useRef(null); //also for category



  useEffect(() => {    //this is for category 
    if (containerRef.current) {
      const rowCount = Math.round(
        containerRef.current.scrollHeight / containerRef.current.children[0]?.offsetHeight
      );
      setIsMultiRow(rowCount >= 2);
    }
  }, [categories]);


  // 🔥 Fetch Images from MongoDB
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        let userId = null;

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            userId =
              parsedUser?._id?.toString() ||
              parsedUser?.googleId?.toString() ||
              parsedUser?.githubId?.toString() ||
              parsedUser?.discordId?.toString() ||
              null;

            console.log("📌 Extracted userId from LocalStorage:", userId);
          } catch (error) {
            console.error("❌ Error parsing user data:", error);
          }
        }

        const url = userId
          ? `http://localhost:5000/api/gallery?userId=${encodeURIComponent(userId)}`
          : `http://localhost:5000/api/gallery`;

        console.log("🔗 Fetching from URL:", url);

        const response = await axios.get(url);
        const data = response.data;

        if (!data.images || data.images.length === 0) {
          setMessage("No images found.");
        } else {
          setMessage("");
          setImages(data.images);
        }

        console.log(`✅ Fetched from: ${data.source}`, data.images);
      } catch (error) {
        console.error("❌ Error fetching images:", error);
        setMessage("Failed to load images.");
      }
    };

    fetchImages();
  }, []);


  useEffect(() => {
    // Check if there's an image ID in the URL parameters
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
        const response = await fetch("http://localhost:5000/api/uploads/categories");
        const data = await response.json();

        if (data.categories) {
          let categoryArray = Object.entries(data.categories).map(([name, count]) => ({
            name,
            count,
          }));

          // 🔥 Remove "All" from the category list if it already exists
          categoryArray = categoryArray.filter(cat => cat.name !== "All");

          // 🔥 Always add "All" at the very beginning
          categoryArray.unshift({ name: "All", count: images.length });

          setCategories(categoryArray);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [images]); // 🔥 Depend on images to update the count for "All"  

  // ✅ Fetch Like Count & Status
  const fetchLikeData = async (imageId) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    let parsedUser;
    try {
      parsedUser = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return;
    }

    const userId = parsedUser?._id || parsedUser?.googleId || parsedUser?.githubId || parsedUser?.discordId;
    if (!userId) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/likes/count/${imageId}?userId=${userId}`
      );
      const data = await response.json();
      setLikeCount(data.likeCount);
      setLiked(data.userLiked);
    } catch (error) {
      console.error("Error fetching like data:", error);
    }
  };

  // ✅ Toggle Like
  const handleLikeToggle = async () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("You need to log in to like images.");
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return;
    }

    const userId = parsedUser?._id || parsedUser?.googleId || parsedUser?.githubId || parsedUser?.discordId;
    if (!userId) {
      alert("User ID missing, please re-login.");
      return;
    }

    if (!selectedImage || !selectedImage._id) {
      console.error("❌ No selected image or missing imageId.");
      return;
    }

    console.log("🔄 Sending like request for", selectedImage._id, "by", userId);

    try {
      const response = await fetch("http://localhost:5000/api/likes/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, imageId: selectedImage._id }),
      });

      const data = await response.json();
      console.log("✅ Like Response:", data);

      if (!response.ok) throw new Error(data.message || "Failed to toggle like");

      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error("❌ Error toggling like:", error);
    }
  };

  // ✅ Download Image
  const handleDownload = async (imageSrc, title, imageId) => {
    console.log("🖼 Downloading image:", imageSrc, "Title:", title, "ImageId:", imageId);

    try {
      const response = await fetch(imageSrc);
      console.log("✅ Fetch status:", response.status);

      if (!response.ok) throw new Error("⛔ Fetch failed!");

      const blob = await response.blob();
      console.log("✅ Blob created:", blob);

      const url = URL.createObjectURL(blob);
      console.log("✅ Object URL:", url);

      const link = document.createElement("a");
      link.href = url;
      link.download = title || "downloaded-image.jpg";

      link.addEventListener("click", () => console.log("✅ Download triggered!"));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("⛔ Download error:", error);
    }
  };


  // ✅ Share Image
  const handleShare = async (imageId) => {
    const shareableLink = `${window.location.origin}/gallery?id=${imageId}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert("Link copied to clipboard!");
    });

    // Log the share action in Clicks API
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userId = JSON.parse(storedUser)?._id;
      if (userId) {
        await fetch("http://localhost:5000/api/clicks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, imageId, action: "shares" }),
        });
      }
    }
  };

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((img) => img.category.includes(selectedCategory));

  // ✅ Open modal & update URL
  const openModal = async (image) => {
    setSelectedImage(image);
    fetchLikeData(image._id);
    navigate(`/gallery?image=${encodeURIComponent(image.imageUrl)}`);

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    let parsedUser;
    try {
      parsedUser = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return;
    }

    const userId = parsedUser?._id || parsedUser?.googleId || parsedUser?.githubId || parsedUser?.discordId;
    if (!userId) return;

    try {
      await axios.post("http://localhost:5000/api/clicks", {
        userId,
        imageId: image._id,
        action: "clicks",  // ✅ Add action field
        timestamp: new Date().toISOString(),
      });
      console.log("Click logged successfully!");
    } catch (error) {
      console.error("Error logging click:", error);
    }
  };

  const logClick = async (image) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    let parsedUser;
    try {
      parsedUser = JSON.parse(storedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return;
    }

    const userId = parsedUser?._id || parsedUser?.googleId || parsedUser?.githubId || parsedUser?.discordId;
    if (!userId) return;

    try {
      await axios.post("http://localhost:5000/api/clicks", {
        userId,
        imageId: image._id,
        action: "clicks",  // ✅ Ensure "action" is included
        timestamp: new Date().toISOString(),
      });
      console.log("Click logged successfully!");
    } catch (error) {
      console.error("Error logging click:", error);
    }
  };

  const logUserAction = async (userId, imageId, actionType) => {
    if (!userId || !imageId || !actionType) {
      console.error("❌ Missing parameters:", { userId, imageId, action: actionType });
      return;
    }

    console.log(`📩 Sending action: ${actionType} for image: ${imageId}`);

    try {
      const response = await fetch("http://localhost:5000/api/clicks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, imageId, action: actionType }),
      });

      const data = await response.json();
      console.log("✅ Response from server:", data);
    } catch (error) {
      console.error("❌ Error logging action:", error);
    }
  };



  // ✅ Close modal & reset URL
  const closeModal = () => {
    setSelectedImage(null);
    navigate("/gallery"); // Reset to gallery page
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
      
      <div className="container min-h-screen mx-auto mt-16 p-4 bg-black">
        <h2 className="text-3xl font-bold text-[#E5E7EB] mb-6 text-center">Art Gallery</h2>

        {/* Category Filter */}
        <div>
          <div className="flex flex-wrap gap-4 justify-center mb-6" ref={containerRef}>
            {categories.map((cat) => (
              <button
                key={cat.name}
                className={`px-4 py-2 rounded-full text-white ${selectedCategory === cat.name ? "bg-blue-500" : "bg-gray-700"
                  } hover:bg-blue-600 transition`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>


        </div>

        {/* Debugging: Log fetched images */}
        <p className="text-center text-gray-400 text-sm">
          {images.length > 0 ? `Showing ${images.length} images` : "No images available"}
        </p>

        {message && <p className="text-center text-[#D1D5DB] mt-4">{message}</p>}

        {/* Gallery Images */}
        <div className="columns-2 md:columns-3 md:gap-4 gap-3 space-y-4 md:space-y-4 p-2">
          {filteredImages.map((image) => (
            <div key={image._id} className="cursor-pointer">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-auto object-cover rounded-lg transition"
                onClick={() => openModal(image)} // ✅ Open modal & update URL
              />
            </div>
          ))}
        </div>

        {/* Selected Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 text-[#D1D5DB] flex flex-col p-4 z-50 overflow-y-auto">
            <div className="relative mx-auto max-w-4xl w-full bg-[#0A0F1F] p-4 rounded-lg shadow-lg">
              <button
                className="absolute top-2 right-2 font-semibold text-[#D1D5DB] text-2xl bg-gray-800 rounded-full p-2 hover:bg-gray-700"
                onClick={closeModal} // ✅ Close modal & reset URL
              >
                <CgClose className="text-sm" />
              </button>

              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full max-h-[60vh] object-contain rounded-lg"
              />

              <div className="flex flex-col justify-center items-center">
                <h3 className="text-xl font-semibold mt-2">{selectedImage.title}</h3>
                <p className="text-gray-300 text-sm">{selectedImage.description}</p>
                <span className="text-gray-400 text-xs">By {selectedImage.author}</span>
              </div>

              {/* 🔥 Categories as Tags */}
              {selectedImage.category && selectedImage.category.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                  {selectedImage.category.map((cat, index) => (
                    <span key={index} className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                      <FaTags />{cat}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-6 mt-3 justify-center">
                <div className="flex flex-col items-center cursor-pointer" onClick={handleLikeToggle}>
                  {liked ? <FaHeart className="text-2xl text-red-500" /> : <FaRegHeart className="text-2xl" />}
                  <span>{likeCount}</span>
                </div>
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleShare(selectedImage._id)}
                >
                  <PiPaperPlaneTiltBold className="text-2xl" />
                  <span>Share</span>
                </div>
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => {
                    console.log("🔍 Selected Image:", selectedImage);
                    handleDownload(selectedImage.imageUrl, selectedImage.title, selectedImage._id);
                  }}
                >
                  <FiDownload className="text-2xl" />
                  <span>Download</span>
                </div>
              </div>
            </div>

            {/* Recommendations div */}
            <h2 className="text-xl font-semibold text-center mt-4">Recommendations</h2>
            <div className="columns-2 md:columns-3 gap-6 space-y-6 p-2">
              {images
                .filter((img) => img !== selectedImage)
                .map((img, index) => (
                  <img
                    key={index}
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full object-cover rounded-lg cursor-pointer transition"
                    onClick={() => openModal(img)} // ✅ Updates URL on new selection
                  />
                ))}
            </div>
          </div>
        )}
      </div>

    </>
  );
};


export default Gallery;