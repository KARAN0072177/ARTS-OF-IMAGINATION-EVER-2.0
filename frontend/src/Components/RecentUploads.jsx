import React, { useState, useEffect, useRef } from "react";
import { CgClose } from "react-icons/cg";
import { FaHeart, FaRegHeart, FaTags } from "react-icons/fa";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { FiDownload } from "react-icons/fi";
import { useLocation } from "react-router-dom"; // import for handling URL params
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Helmet } from 'react-helmet-async';

const RecentUploads = () => {
  const [images, setImages] = useState([]); // Fetch from MongoDB
  const [selectedImage, setSelectedImage] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation(); // Access URL parameters
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // 🔥 Store category list
  const [selectedCategory, setSelectedCategory] = useState("All"); // 🔥 Default: Show all images




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
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/uploads`
        );
        const data = response.data;

        if (data.length === 0) {
          setMessage("No images uploaded yet.");
        } else {
          setMessage("");
        }

        console.log("Fetched Images from MongoDB:", data);

        // 🔥 Only keep the latest 60 images
        const latestImages = data.slice(-60).reverse(); // Get the last 60 & reverse to show newest first

        setImages(latestImages); // Store only the latest 60 images
      } catch (error) {
        console.error("Error fetching images:", error);
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/categories`);
        const data = await response.json();

        if (data.categories) {
          let categoryArray = Object.entries(data.categories).map(([name, count]) => ({
            name,
            count,
          }));

          // 🔥 Remove "All" from the category list if it already exists
          categoryArray = categoryArray.filter(cat => cat.name !== "All");

          // 🔥 Always add "All" at the very beginning
          categoryArray.unshift({ name: "All", count: Math.min(images.length, 60) });

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

    const userId = parsedUser?._id || parsedUser?.googleId || parsedUser?.githubId;
    if (!userId) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/likes/count/${imageId}?userId=${userId}`
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
      alert("Invalid user session, please re-login.");
      return;
    }

    const userId = parsedUser?._id || parsedUser?.googleId || parsedUser?.githubId;
    if (!userId) {
      alert("User ID missing, please re-login.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/likes/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, imageId: selectedImage._id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to toggle like");

      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (error) {
      console.error("❌ Error toggling like:", error);
    }
  };

  // ✅ Download Image
  const handleDownload = async (imageSrc, title) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = title || "downloaded-image.jpg"; // Ensure a default file name with an extension
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL to free memory
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  // ✅ Share Image
  const handleShare = (imageId) => {
    const shareableLink = `${window.location.origin}/gallery?id=${imageId}`;
    navigator.clipboard.writeText(shareableLink).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((img) => img.category.includes(selectedCategory));

  // ✅ Open modal & update URL
  const openModal = (image) => {
    setSelectedImage(image);
    fetchLikeData(image._id); // ✅ Fetch like data when opening modal
    navigate(`/recent-uploads?image=${encodeURIComponent(image.imageUrl)}`);
  };

  // ✅ Close modal & reset URL
  const closeModal = () => {
    setSelectedImage(null);
    navigate("/recent-uploads"); // Reset to gallery page
  };

  return (

    <>
      <Helmet>
        <title>Recent Uploads | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="Browse the latest uploads on ARTS OF IMAGINATION EVER. Discover new images, authors, and categories added to our gallery." />
        <meta property="og:title" content="Recent Uploads | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="Browse the latest uploads on ARTS OF IMAGINATION EVER. Discover new images, authors, and categories added to our gallery." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container min-h-screen mx-auto mt-16 p-4 bg-black">
        <h2 className="text-3xl font-bold text-[#E5E7EB] mb-6 text-center">Recent Uploads</h2>
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
                  onClick={() => handleDownload(selectedImage.imageUrl, selectedImage.title)}
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


export default RecentUploads;