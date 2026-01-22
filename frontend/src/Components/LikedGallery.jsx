import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';
import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';

const LikedGallery = () => {
    const [likedImages, setLikedImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortOption, setSortOption] = useState("recent");

    const fetchLikeCount = async (imageId, userId) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/likes/count/${imageId}?userId=${userId}`);
            return res.data.likeCount;
        } catch (err) {
            console.error("Error fetching like count for image:", imageId, err);
            return 0;
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const loginMethod = localStorage.getItem("loginMethod");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUsername(parsedUser.username || "Friend");

            if (loginMethod) {
                const userId =
                    loginMethod === "google"
                        ? parsedUser.googleId
                        : loginMethod === "github"
                            ? parsedUser.githubId
                            : loginMethod === "discord"
                                ? parsedUser.discordId
                                : parsedUser._id || parsedUser.email;

                axios
                    .get(`http://localhost:5000/api/liked-images/${userId}`)
                    .then(async (res) => {
                        const imagesWithLikes = await Promise.all(
                            res.data.map(async (img) => {
                                const likeCount = await fetchLikeCount(img._id, userId);
                                return { ...img, likeCount };
                            })
                        );
                        setLikedImages(imagesWithLikes);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.error("Failed to fetch liked images:", err);
                        setLoading(false);
                    });
            }
        }
    }, []);

    // Get all unique categories from liked images
    const allCategories = [...new Set(
        likedImages.flatMap(img => img.category || [])
    )];

    // Filter and sort logic
    const filteredImages = likedImages
        .filter(img => {
            const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                img.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "all" || 
                                   (img.category && img.category.includes(selectedCategory));
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortOption === "recent") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortOption === "likes") {
                return b.likeCount - a.likeCount;
            } else if (sortOption === "title") {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    return (
        <>
            <Helmet>
                <title>Liked Images Gallery | ARTS OF IMAGINATION EVER</title>
                <meta name="description" content="Browse through the images you have liked on ARTS OF IMAGINATION EVER and revisit your favorite artwork." />
                <meta property="og:title" content="Liked Images Gallery | ARTS OF IMAGINATION EVER" />
                <meta property="og:description" content="Browse through the images you have liked on ARTS OF IMAGINATION EVER and revisit your favorite artwork." />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pt-20 px-4 pb-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6"
                    >
                        <div>
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                Your Liked Gallery
                            </h1>
                            <p className="text-gray-400 mt-2">
                                Hello {username}, here are the images you've loved ❤️
                            </p>
                        </div>
                        
                        <Link
                            to="/gallery"
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                        >
                            <FaArrowLeft /> Back to Gallery
                        </Link>
                    </motion.div>

                    {/* Controls Section */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-10 bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700"
                    >
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <div className="relative flex-grow w-full md:w-auto">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search your liked images..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                <select
                                    className="bg-gray-900 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    {allCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                
                                <select
                                    className="bg-gray-900 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="recent">Recently Liked</option>
                                    <option value="likes">Most Popular</option>
                                    <option value="title">Alphabetical</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="w-16 h-16 bg-purple-600 rounded-full mb-4"></div>
                                <p className="text-gray-400">Loading your favorite images...</p>
                            </div>
                        </div>
                    ) : filteredImages.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-20"
                        >
                            <div className="text-6xl mb-4">🖤</div>
                            <h3 className="text-2xl font-semibold text-gray-300 mb-2">Your liked gallery is empty</h3>
                            <p className="text-gray-500 mb-6">Start exploring and like some images to see them here!</p>
                            <Link 
                                to="/gallery" 
                                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
                            >
                                Explore Gallery
                            </Link>
                        </motion.div>
                    ) : (
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="flex gap-6"
                            columnClassName="flex flex-col gap-6"
                        >
                            {filteredImages.map((img, index) => (
                                <motion.div
                                    key={img._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Link
                                        to={`/gallery?id=${img._id}`}
                                        className="block group"
                                    >
                                        <div className="relative overflow-hidden rounded-xl bg-gray-800 border border-gray-700 transition-all duration-300 group-hover:border-purple-500">
                                            {/* Image with gradient overlay */}
                                            <div className="relative aspect-square overflow-hidden">
                                                <img
                                                    src={img.imageUrl}
                                                    alt={img.title}
                                                    onError={(e) => {
                                                        e.target.src = "/fallback.jpg";
                                                    }}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            
                                            {/* Content overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-5 group-hover:translate-y-0 transition-transform duration-300">
                                                <h3 className="text-xl font-bold text-white mb-1">{img.title}</h3>
                                                <p className="text-gray-300 text-sm line-clamp-2">{img.description}</p>
                                                
                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                                                        {img.likeCount} likes
                                                    </span>
                                                    <span className="text-xs text-gray-400">by {img.author}</span>
                                                </div>
                                                
                                                {img.category?.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {img.category.map((cat, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs bg-gray-700/80 text-white px-2 py-0.5 rounded-full"
                                                            >
                                                                {cat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Heart indicator */}
                                            <div className="absolute top-4 right-4 p-2 bg-black/50 rounded-full">
                                                <FaHeart className="text-pink-500 text-xl" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </Masonry>
                    )}
                </div>
            </div>
        </>
    );
};

export default LikedGallery;