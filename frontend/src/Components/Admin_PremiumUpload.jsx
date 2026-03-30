import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX, FiPlus, FiImage, FiEdit2, FiUser, FiTag, FiStar, FiLayers } from "react-icons/fi";
import { GiDiamondTrophy, GiCrystalBars } from "react-icons/gi";
import axios from "axios";
import Admin_Nav from "./Admin_Nav";

export default function Admin_PremiumUpload() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    imageUrl: "",
    categories: [],
    resolution2k: "",
    resolution4k: "",
    resolution8k: "",
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [premiumGallery, setPremiumGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [activeResolutions, setActiveResolutions] = useState({
    res2k: false,
    res4k: false,
    res8k: false,
  });

  useEffect(() => {
    fetchPremiumImages();
  }, []);

  const fetchPremiumImages = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/premium`
      );

      setPremiumGallery(res.data);

    } catch (err) {
      console.error("Error fetching premium uploads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => setCategoryInput(e.target.value);

  const handleAddCategory = () => {
    const trimmed = categoryInput.trim();
    if (trimmed && !formData.categories.includes(trimmed)) {
      setFormData({ ...formData, categories: [...formData.categories, trimmed] });
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (cat) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter((c) => c !== cat),
    });
  };

  const handleToggleResolution = (resKey) => {
    setActiveResolutions((prev) => ({ ...prev, [resKey]: !prev[resKey] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageUrl || formData.categories.length === 0) {
      return alert("Image URL and at least one category are required.");
    }

    if (
      !formData.resolution2k.trim() &&
      !formData.resolution4k.trim() &&
      !formData.resolution8k.trim()
    ) {
      return alert("Please provide at least one resolution URL (2K, 4K, or 8K).");
    }

    try {
      setIsLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/premium`,
        {
          ...formData,
          category: formData.categories,
        }
      );

      alert("Premium image uploaded successfully!");
      setFormData({
        title: "",
        description: "",
        author: "",
        imageUrl: "",
        categories: [],
        resolution2k: "",
        resolution4k: "",
        resolution8k: "",
      });
      setActiveResolutions({ res2k: false, res4k: false, res8k: false });
      fetchPremiumImages();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload premium image.");
    } finally {
      setIsLoading(false);
    }
  };

  const getResolutionIcon = (resolution) => {
    switch (resolution) {
      case "2k": return <FiStar className="text-yellow-400" />;
      case "4k": return <GiCrystalBars className="text-blue-400" />;
      case "8k": return <GiDiamondTrophy className="text-purple-400" />;
      default: return <FiLayers />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Admin_Nav />

      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-4">
            <GiDiamondTrophy className="text-xl" />
            <h1 className="text-2xl font-bold">Premium Content Portal</h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload and manage exclusive high-resolution artwork for premium members
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === "upload" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300"}`}
            >
              <FiUpload />
              Upload Premium Art
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === "gallery" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300"}`}
            >
              <FiImage />
              Premium Gallery ({premiumGallery.length})
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === "upload" && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <GiDiamondTrophy className="text-yellow-400" />
                  Upload Premium Artwork
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-gray-300 flex items-center gap-2">
                      <FiEdit2 className="text-blue-300" />
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter artwork title"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 flex items-center gap-2">
                      <FiEdit2 className="text-blue-300" />
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter artwork description"
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 flex items-center gap-2">
                      <FiUser className="text-blue-300" />
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Enter author name"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 flex items-center gap-2">
                      <FiTag className="text-blue-300" />
                      Categories
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={categoryInput}
                        onChange={handleCategoryChange}
                        placeholder="Enter category"
                        className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <motion.button
                        type="button"
                        onClick={handleAddCategory}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 bg-gradient-to-r from-blue-500 to-teal-400 text-black font-bold rounded-lg flex items-center gap-2"
                      >
                        <FiPlus />
                        Add
                      </motion.button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.categories.map((cat, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black rounded-full flex items-center gap-1 font-medium"
                        >
                          {cat}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(cat)}
                            className="ml-1 text-black hover:text-red-700"
                          >
                            <FiX size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 flex items-center gap-2">
                      <FiImage className="text-blue-300" />
                      Preview Image URL
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="Paste preview image URL"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Resolution Toggles */}
                  <div className="space-y-1">
                    <label className="text-gray-300 flex items-center gap-2">
                      <FiLayers className="text-blue-300" />
                      High-Res Versions
                    </label>
                    <div className="flex gap-3">
                      {['2k', '4k', '8k'].map((res) => (
                        <motion.button
                          key={res}
                          type="button"
                          onClick={() => handleToggleResolution(`res${res}`)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${activeResolutions[`res${res}`]
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                          {getResolutionIcon(res)}
                          {res.toUpperCase()}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Resolution Inputs */}
                  {activeResolutions.res2k && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1"
                    >
                      <label className="text-gray-300 flex items-center gap-2">
                        <FiStar className="text-yellow-400" />
                        2K Resolution URL
                      </label>
                      <input
                        type="text"
                        name="resolution2k"
                        value={formData.resolution2k}
                        onChange={handleChange}
                        placeholder="Paste 2K resolution URL"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </motion.div>
                  )}

                  {activeResolutions.res4k && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1"
                    >
                      <label className="text-gray-300 flex items-center gap-2">
                        <GiCrystalBars className="text-blue-400" />
                        4K Resolution URL
                      </label>
                      <input
                        type="text"
                        name="resolution4k"
                        value={formData.resolution4k}
                        onChange={handleChange}
                        placeholder="Paste 4K resolution URL"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </motion.div>
                  )}

                  {activeResolutions.res8k && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1"
                    >
                      <label className="text-gray-300 flex items-center gap-2">
                        <GiDiamondTrophy className="text-purple-400" />
                        8K Resolution URL
                      </label>
                      <input
                        type="text"
                        name="resolution8k"
                        value={formData.resolution8k}
                        onChange={handleChange}
                        placeholder="Paste 8K resolution URL"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-black flex items-center justify-center gap-2 ${isLoading
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200'
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <GiDiamondTrophy />
                        Upload Premium Artwork
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {activeTab === "gallery" && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <GiDiamondTrophy className="text-yellow-400" />
                  Premium Gallery ({premiumGallery.length} items)
                </h2>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                  </div>
                ) : premiumGallery.length === 0 ? (
                  <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
                    <GiDiamondTrophy className="mx-auto text-4xl text-gray-500 mb-4" />
                    <p className="text-gray-400">No premium artworks uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {premiumGallery.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-yellow-400/50 transition-all shadow-lg hover:shadow-yellow-400/20"
                      >
                        <div className="relative aspect-square group">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <div className="flex gap-2">
                              {item.resolution2k && (
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs flex items-center gap-1">
                                  <FiStar size={12} /> 2K
                                </span>
                              )}
                              {item.resolution4k && (
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs flex items-center gap-1">
                                  <GiCrystalBars size={12} /> 4K
                                </span>
                              )}
                              {item.resolution8k && (
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs flex items-center gap-1">
                                  <GiDiamondTrophy size={12} /> 8K
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{item.description}</p>
                          <p className="text-gray-400 text-xs mb-3">By: {item.author}</p>
                          <div className="flex flex-wrap gap-1">
                            {item.category.map((cat, i) => (
                              <span key={i} className="px-2 py-1 text-xs bg-gradient-to-r from-yellow-500/20 to-yellow-300/20 text-yellow-300 rounded-full">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}