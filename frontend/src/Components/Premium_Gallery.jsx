import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { FaDownload, FaPaintBrush, FaShare, FaTags, FaUser, FaCrown, FaLock, FaUnlock } from "react-icons/fa";
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from "framer-motion";

export default function PremiumGallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const location = useLocation();
    const [shareUrl, setShareUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showAllImages, setShowAllImages] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [isPremium, setIsPremium] = useState(false);

    // Fetch images
    useEffect(() => {
        const fetchPremiumImages = async () => {
            const query = new URLSearchParams(location.search);
            const sessionId = query.get("session_id");

            if (sessionId) {
                try {
                    const confirmRes = await axios.post(
                        `${import.meta.env.VITE_API_URL}/api/stripe/confirm-payment`,
                        {
                            sessionId,
                        }
                    );
                    console.log("✅ Premium upgrade confirmed:", confirmRes.data);
                } catch (err) {
                    console.error("❌ Failed to confirm premium payment:", err);
                }
            }

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/premium`
                );
                setImages(res.data);

                const urlPart = location.pathname.split("/pgallery/")[1];
                if (urlPart) {
                    const decodedUrl = decodeURIComponent(urlPart);
                    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(decodedUrl);
                    if (isUUID) {
                        try {
                            const response = await axios.get(
                                `${import.meta.env.VITE_API_URL}/api/share/${decodedUrl}`
                            );
                            setSelectedImage(response.data.image);
                            setError(null);
                        } catch (err) {
                            console.error("Invalid or expired share link:", err);
                            setError("⚠️ This shared image link has expired or is invalid.");
                            setSelectedImage(null);
                        }
                    } else {
                        const match = res.data.find((img) => img.imageUrl === decodedUrl);
                        if (match) setSelectedImage(match);
                    }
                }

                if (res.data.length === 0) setMessage("No premium artworks available.");
                else setMessage("");

                await checkPremiumStatus();

            } catch (err) {
                console.error("Error fetching premium gallery:", err);
                setMessage("Failed to load premium gallery.");
            } finally {
                setLoading(false);
            }
        };

        const checkPremiumStatus = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const authMethod = localStorage.getItem("loginMethod");

                let userId;
                switch (authMethod) {
                    case 'google':
                        userId = user?.googleId;
                        break;
                    case 'github':
                        userId = user?.githubId;
                        break;
                    case 'discord':
                        userId = user?.discordId;
                        break;
                    case 'manual':
                    case 'email':
                        userId = user?.email;
                        break;
                    default:
                        return;
                }

                if (!userId || !authMethod) return;

                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/stripe/is-premium`,
                    {
                        userId,
                        authMethod,
                    }
                );

                if (res.data.premium) {
                    setIsPremium(true);
                    setShowAllImages(true);
                }
            } catch (err) {
                console.error("Error checking premium status:", err);
            }
        };

        fetchPremiumImages();
    }, [location]);

    // Handle browser back button (close modal)
    useEffect(() => {
        const handlePopState = () => {
            setSelectedImage(null);
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    // Trigger download
    const triggerDownload = (url) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = "premium-image";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/share`,
                {
                    imageId: selectedImage._id,
                }
            );
            setShareUrl(res.data.shareUrl);
            setCopied(false);
            setShowPopup(true);
        } catch (error) {
            console.error("Error generating share link:", error);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Open modal + update URL
    const openImageModal = (img) => {
        window.history.pushState({}, "", `/pgallery/${encodeURIComponent(img.imageUrl)}`);
        setSelectedImage(img);
    };

    // Close modal + reset URL
    const closeModal = () => {
        window.history.pushState({}, "", "/pgallery");
        setSelectedImage(null);
    };

    // Handle Stripe checkout
    const handlePayment = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const authMethod = localStorage.getItem("loginMethod");

            let userId;

            switch (authMethod) {
                case 'google':
                    userId = user?.googleId;
                    break;
                case 'github':
                    userId = user?.githubId;
                    break;
                case 'discord':
                    userId = user?.discordId;
                    break;
                case 'manual':
                case 'email':
                    userId = user?.email;
                    break;
                default:
                    console.warn("⚠️ Unknown auth method");
                    break;
            }

            if (!userId) {
                console.error("❌ User ID is missing for the selected auth method.");
                setPaymentStatus('failure');
                return;
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`,
                {
                    userId,
                    authMethod,
                }
            );

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error("🔥 Error during payment:", error);
            setPaymentStatus('failure');
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    return (
        <>
            <Helmet>
                <title>Premium Gallery | ARTS OF IMAGINATION EVER</title>
                <meta name="description" content="Explore our exclusive Premium Gallery at ARTS OF IMAGINATION EVER, featuring stunning artwork and high-resolution images for our premium members." />
                <meta property="og:title" content="Premium Gallery | ARTS OF IMAGINATION EVER" />
                <meta property="og:description" content="Explore our exclusive Premium Gallery at ARTS OF IMAGINATION EVER, featuring stunning artwork and high-resolution images for our premium members." />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-24 px-4 sm:px-6 lg:px-12 pb-20">
                {/* Premium Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full filter blur-3xl opacity-20"></div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl font-bold mb-4 tracking-tight"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500">
                            Premium Gallery
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-lg text-gray-300 max-w-2xl mx-auto"
                    >
                        Exclusive high-resolution artworks for our premium members
                    </motion.p>
                    {isPremium && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, type: "spring" }}
                            className="mt-4 inline-flex items-center bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-4 py-2 rounded-full text-sm font-bold"
                        >
                            <FaCrown className="mr-2" /> Premium Member
                        </motion.div>
                    )}
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-600/90 text-white px-6 py-4 mb-8 rounded-xl text-center font-semibold shadow-lg backdrop-blur-sm max-w-2xl mx-auto"
                    >
                        {error}
                    </motion.div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
                    </div>
                ) : message ? (
                    <p className="text-center text-gray-400">{message}</p>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        {/* Gallery Grid */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="columns-1 sm:columns-2 lg:columns-3 gap-6 w-full"
                        >
                            {(showAllImages ? images : images.slice(0, 4)).map((img) => (
                                <motion.div
                                    key={img._id}
                                    variants={itemVariants}
                                    className="mb-6 relative group break-inside-avoid"
                                >
                                    <div
                                        onClick={() => openImageModal(img)}
                                        className="relative overflow-hidden rounded-xl shadow-xl cursor-pointer transform transition duration-500 group-hover:scale-[1.02]"
                                    >
                                        <img
                                            src={img.imageUrl}
                                            alt={img.title}
                                            className="w-full h-auto rounded-xl transition-opacity duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <div>
                                                <h3 className="text-white font-bold text-lg">{img.title}</h3>
                                                {img.category && img.category.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {img.category.slice(0, 2).map((cat, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="bg-yellow-500/90 text-black text-xs font-semibold px-2 py-1 rounded-full"
                                                            >
                                                                {cat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {!showAllImages && (
                                        <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                                            <FaLock className="text-yellow-400 text-3xl" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA Box */}
                        {!isPremium && !showAllImages && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="mt-16 mb-20 p-8 bg-gradient-to-br from-gray-800/50 to-gray-900/70 rounded-2xl shadow-2xl border border-gray-700/50 backdrop-blur-sm max-w-2xl w-full text-center"
                            >
                                <div className="mb-6 flex justify-center">
                                    <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-3 rounded-full">
                                        <FaCrown className="text-2xl text-black" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-300">
                                    Unlock the Full Premium Collection
                                </h2>
                                <p className="text-gray-300 mb-6 max-w-md mx-auto">
                                    Upgrade to premium for unlimited access to our exclusive high-resolution artworks, including 4K and 8K downloads.
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handlePayment}
                                        className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-bold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <FaUnlock /> Upgrade Now
                                    </motion.button>
                                    <button className="border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 font-medium px-6 py-3 rounded-lg transition-all duration-300">
                                        Learn More
                                    </button>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-700/50">
                                    <div className="flex flex-col sm:flex-row justify-center gap-8 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <FaDownload className="text-yellow-400" /> High-Res Downloads
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaPaintBrush className="text-yellow-400" /> Exclusive Content
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaUser className="text-yellow-400" /> Priority Support
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Modal */}
                <AnimatePresence>
                    {selectedImage && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-12">
                            <motion.div
                                variants={modalVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="relative w-full max-w-5xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] border border-gray-700/50"
                            >
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-6 text-2xl text-gray-300 hover:text-yellow-400 transition z-10"
                                >
                                    &times;
                                </button>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Improved Image Container */}
                                    <div className="relative flex items-center justify-center min-h-[400px] max-h-[70vh]">
                                        <img
                                            src={selectedImage.imageUrl}
                                            alt={selectedImage.title}
                                            className="max-w-full max-h-full object-contain rounded-xl"
                                            style={{
                                                width: 'auto',
                                                height: 'auto',
                                                maxWidth: '100%',
                                                maxHeight: '100%'
                                            }}
                                        />
                                    </div>

                                    {/* Text Info */}
                                    <div className="py-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h2 className="text-3xl font-bold text-yellow-400 mb-2 flex items-center gap-3">
                                                    {selectedImage.title}
                                                    {isPremium && <FaCrown className="text-amber-300" />}
                                                </h2>
                                                {selectedImage.description && (
                                                    <p className="text-gray-300 mb-4 italic">
                                                        {selectedImage.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 text-gray-300">
                                                <div className="bg-gray-700/50 p-2 rounded-full">
                                                    <FaUser className="text-yellow-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400">Artist</p>
                                                    <p className="font-medium">{selectedImage.author}</p>
                                                </div>
                                            </div>

                                            {selectedImage.category && selectedImage.category.length > 0 && (
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-2">Categories</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedImage.category.map((cat, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="bg-yellow-500/90 text-black text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                                                            >
                                                                {cat} <FaTags size={10} />
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Download Buttons */}
                                            <div>
                                                <p className="text-xs text-gray-400 mb-2">Download Options</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    {selectedImage.resolution2k && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            onClick={() => triggerDownload(selectedImage.resolution2k)}
                                                            className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black font-bold px-4 py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <FaDownload /> 2K
                                                        </motion.button>
                                                    )}
                                                    {selectedImage.resolution4k && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            onClick={() => triggerDownload(selectedImage.resolution4k)}
                                                            className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black font-bold px-4 py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <FaDownload /> 4K
                                                        </motion.button>
                                                    )}
                                                    {selectedImage.resolution8k && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            onClick={() => triggerDownload(selectedImage.resolution8k)}
                                                            className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black font-bold px-4 py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <FaDownload /> 8K
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Share Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleShare}
                                                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 border border-gray-600/50 mt-4"
                                            >
                                                <FaShare /> Share This Artwork
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
                {/* Share Popup */}
                <AnimatePresence>
                    {showPopup && (
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-700/50"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                                        <FaShare /> Share This Artwork
                                    </h3>
                                    <button
                                        onClick={() => setShowPopup(false)}
                                        className="text-gray-400 hover:text-white text-2xl"
                                    >
                                        &times;
                                    </button>
                                </div>
                                <p className="text-gray-300 mb-4 text-sm">
                                    Copy the link below to share this premium artwork:
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={shareUrl}
                                        className="bg-gray-700/50 border border-gray-600/50 text-white rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                        onClick={(e) => e.target.select()}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleCopy}
                                        className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap"
                                    >
                                        {copied ? "Copied!" : "Copy Link"}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}