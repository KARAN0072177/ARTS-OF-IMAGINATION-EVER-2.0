import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX, FiPlus, FiImage, FiEdit2, FiUser, FiTag } from "react-icons/fi";
import axios from "axios";
import Admin_Nav from "./Admin_Nav";

export default function AdminPanel() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    categories: [],
    imageUrl: "",
  });

  const [categoryInput, setCategoryInput] = useState("");
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/uploads");
      setGallery(res.data);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    setCategoryInput(e.target.value);
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData({ ...formData, categories: [...formData.categories, categoryInput.trim()] });
      setCategoryInput("");
    }
  };

  const handleRemoveCategory = (category) => {
    setFormData({ ...formData, categories: formData.categories.filter((cat) => cat !== category) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) return alert("Please provide an image URL.");
    if (formData.categories.length === 0) return alert("Please add at least one category.");
  
    try {
      setIsLoading(true);
      await axios.post("http://localhost:5000/api/uploads", {
        ...formData,
        category: formData.categories,
      });
      alert("Image uploaded successfully!");
      fetchGallery();
      setFormData({ title: "", description: "", author: "", categories: [], imageUrl: "" });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <Admin_Nav />
      
      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === "upload" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300"}`}
            >
              <FiUpload />
              Upload Artwork
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-4 py-3 font-medium text-sm flex items-center gap-2 ${activeTab === "gallery" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300"}`}
            >
              <FiImage />
              Gallery ({gallery.length})
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
                  <FiUpload className="text-blue-400" />
                  Upload New Artwork
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
                        className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2"
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
                          className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full flex items-center gap-1 border border-blue-500/30"
                        >
                          {cat}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(cat)}
                            className="text-red-300 hover:text-red-200"
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
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="Paste image URL"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 ${
                      isLoading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload />
                        Upload Artwork
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
                  <FiImage className="text-blue-400" />
                  Gallery ({gallery.length} items)
                </h2>

                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : gallery.length === 0 ? (
                  <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
                    <FiImage className="mx-auto text-4xl text-gray-500 mb-4" />
                    <p className="text-gray-400">No artworks uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gallery.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-colors"
                      >
                        <div className="relative aspect-square">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white text-lg mb-1">{item.title}</h3>
                          <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                          <p className="text-gray-400 text-xs mb-3">By: {item.author}</p>
                          <div className="flex flex-wrap gap-1">
                            {item.category.map((cat, i) => (
                              <span key={i} className="px-2 py-1 text-xs bg-blue-900/30 text-blue-300 rounded-full">
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