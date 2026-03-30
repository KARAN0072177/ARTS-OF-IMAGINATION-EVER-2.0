import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaHistory,
  FaSignOutAlt,
  FaCrown,
  FaPalette,
  FaUserEdit,
  FaCog,
  FaChartLine,
  FaBookmark,
  FaBell,
  FaSignInAlt,
  FaCheckCircle
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Helmet } from 'react-helmet-async';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loginMethod, setLoginMethod] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = localStorage.getItem("user");
      const storedMethod = localStorage.getItem("loginMethod");

      if (!storedUser || !storedMethod || user) return;

      try {
        const parsedUser = JSON.parse(storedUser);
        setLoginMethod(storedMethod);

        let userId;
        switch (storedMethod) {
          case "google":
            userId = parsedUser.googleId;
            break;
          case "github":
            userId = parsedUser.githubId;
            break;
          case "discord":
            userId = parsedUser.discordId;
            break;
          case "manual":
          case "email":
            userId = parsedUser.email;
            break;
          default:
            console.warn("Unknown login method");
            return;
        }

        if (!userId) return;

        const API_BASE = import.meta.env.VITE_API_URL;

        const [profileRes, premiumRes] = await Promise.all([
          axios.get(`${API_BASE}/api/profile/${storedMethod}/${userId}`),
          axios.get(`${API_BASE}/api/stripe/check-premium/${storedMethod}/${userId}`)
        ]);

        const { username, email, avatar } = profileRes.data;

        setUser({ username, email });

        console.log("Profile avatar from backend:", avatar);

        const fallback = `https://ui-avatars.com/api/?name=${username || "User"}&background=0D8ABC&color=fff&size=512`;
        const validAvatar = avatar && avatar.startsWith("http") ? avatar : fallback;

        console.log("Final avatar used:", validAvatar);

        setAvatarUrl(validAvatar);

        setIsPremium(premiumRes.data.isPremium);
      } catch (err) {
        console.error("Error in profile useEffect:", err);
        localStorage.removeItem("user");
      }
    };

    fetchProfile();
  }, [user]);

  const handlePayment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const authMethod = localStorage.getItem("loginMethod");

      let userId;

      switch (authMethod) {
        case "google":
          userId = user?.googleId;
          break;
        case "github":
          userId = user?.githubId;
          break;
        case "discord":
          userId = user?.discordId;
          break;
        case "manual":
        case "email":
          userId = user?.email;
          break;
        default:
          console.warn("Unknown auth method");
          break;
      }

      if (!userId) return;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`,
        { userId, authMethod }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error during premium upgrade:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loginMethod");
    window.location.href = "/login";
  };

  return (
    <>
      <Helmet>
        <title>Profile | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="View and manage your profile on ARTS OF IMAGINATION EVER. Update your personal information, see your purchased images, and more." />
        <meta property="og:title" content="Profile | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="View and manage your profile on ARTS OF IMAGINATION EVER. Update your personal information, see your purchased images, and more." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        {user ? (
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center gap-8 mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <motion.img
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  src={avatarUrl}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=0D8ABC&color=fff&size=512`;
                  }}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full border-4 border-white/20 shadow-xl object-cover"
                />


                {isPremium && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-2 shadow-lg"
                  >
                    <FaCrown className="text-white text-xl" />
                  </motion.div>
                )}
              </motion.div>

              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {user.username}
                  {isPremium && (
                    <span className="ml-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">
                      PRO
                    </span>
                  )}
                </h1>
                <p className="text-gray-300 mb-4">{user.email}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-200 flex items-center">
                    <FaSignInAlt className="mr-2" />
                    {loginMethod ? `${loginMethod.charAt(0).toUpperCase()}${loginMethod.slice(1)}` : "Unknown"}
                  </span>

                  {isPremium ? (
                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-full text-sm text-yellow-300 flex items-center">
                      <FaCrown className="mr-2" />
                      Premium Member
                    </span>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePayment}
                      className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-sm text-black font-bold flex items-center"
                    >
                      <FaCrown className="mr-2" />
                      Upgrade to Premium
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide"
            >
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 mr-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === "overview" ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`px-4 py-2 mr-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === "activity" ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Activity
              </button>
              <button
                onClick={() => setActiveTab("collections")}
                className={`px-4 py-2 mr-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === "collections" ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Collections
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 mr-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === "settings" ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Settings
              </button>
            </motion.div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {activeTab === "overview" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-blue-500/20 mr-4">
                            <FaHeart className="text-blue-400 text-xl" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Liked Images</p>
                            <h3 className="text-2xl font-bold text-white">24</h3>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-purple-500/20 mr-4">
                            <FaBookmark className="text-purple-400 text-xl" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Collections</p>
                            <h3 className="text-2xl font-bold text-white">5</h3>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-green-500/20 mr-4">
                            <FaHistory className="text-green-400 text-xl" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Purchases</p>
                            <h3 className="text-2xl font-bold text-white">{isPremium ? "∞" : "12"}</h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <FaChartLine className="mr-2 text-blue-400" />
                        Recent Activity
                      </h3>
                      <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="flex items-start pb-4 border-b border-gray-700/50 last:border-0">
                            <div className="p-2 rounded-full bg-gray-700 mr-4">
                              <FaPalette className="text-gray-300" />
                            </div>
                            <div>
                              <p className="text-gray-300">
                                You liked "Sunset Over Mountains" artwork
                              </p>
                              <p className="text-gray-500 text-sm mt-1">2 days ago</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium">
                        View All Activity
                      </button>
                    </div>

                    {/* Premium Benefits */}
                    {!isPremium && (
                      <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 rounded-xl p-6 border border-yellow-500/30">
                        <h3 className="text-xl font-semibold text-white mb-3 flex items-center">
                          <FaCrown className="mr-2 text-yellow-400" />
                          Unlock Premium Features
                        </h3>
                        <ul className="space-y-2 text-gray-300 mb-4">
                          <li className="flex items-center">
                            <FaCheckCircle className="text-green-400 mr-2" />
                            Unlimited image downloads with multi-resolitions (2k,4k,8k)
                          </li>
                          <li className="flex items-center">
                            <FaCheckCircle className="text-green-400 mr-2" />
                            Exclusive premium content that regular users cant access
                          </li>
                          <li className="flex items-center">
                            <FaCheckCircle className="text-green-400 mr-2" />
                            Premium Badge beside your Username
                          </li>
                        </ul>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePayment}
                          className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold rounded-lg shadow-lg"
                        >
                          Upgrade Now
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "activity" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                  >
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <FaChartLine className="mr-2 text-blue-400" />
                      Your Activity
                    </h3>
                    <div className="text-center py-12">
                      <div className="inline-block p-4 mb-4 rounded-full bg-gray-700">
                        <FaBell className="text-gray-400 text-2xl" />
                      </div>
                      <h4 className="text-xl font-medium text-white mb-2">Coming Soon</h4>
                      <p className="text-gray-400 max-w-md mx-auto">
                        We're working on a detailed activity feed to track all your interactions with our platform.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "collections" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                  >
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <FaBookmark className="mr-2 text-purple-400" />
                      Your Collections
                    </h3>
                    <div className="text-center py-12">
                      <div className="inline-block p-4 mb-4 rounded-full bg-gray-700">
                        <FaPalette className="text-gray-400 text-2xl" />
                      </div>
                      <h4 className="text-xl font-medium text-white mb-2">Coming Soon</h4>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Soon you'll be able to organize your favorite images into beautiful collections.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                  >
                    <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                      <FaCog className="mr-2 text-gray-400" />
                      Account Settings
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-400 mb-2">Username</label>
                        <input
                          type="text"
                          defaultValue={user.username}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">Login Method</label>
                        <input
                          type="text"
                          defaultValue={loginMethod}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled
                        />
                      </div>
                      <div className="pt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Save Changes
                        </motion.button>
                      </div>
                      <div className="border-t border-gray-700 pt-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleLogout}
                          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
                        >
                          <FaSignOutAlt className="mr-2" />
                          Logout
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link
                      to="/phistory"
                      className="flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <FaHistory className="text-blue-400" />
                      <span>Purchase History</span>
                    </Link>
                    <Link
                      to="/liked"
                      className="flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <FaHeart className="text-pink-400" />
                      <span>Liked Images</span>
                    </Link>
                    {isPremium && (
                      <Link
                        to="/pgallery"
                        className="flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <FaCrown className="text-yellow-400" />
                        <span>Premium Content</span>
                      </Link>
                    )}
                  </div>
                </motion.div>

                {/* Account Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Membership</p>
                      <p className="text-white font-medium">
                        {isPremium ? (
                          <span className="text-yellow-400">Premium Member</span>
                        ) : (
                          "Free Account"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Joined</p>
                      <p className="text-white font-medium">2 months ago</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Last Active</p>
                      <p className="text-white font-medium">Today</p>
                    </div>
                  </div>
                </motion.div>

                {/* Edit Profile */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <FaUserEdit className="mr-2 text-blue-400" />
                    Edit Profile
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Customize your profile appearance and preferences
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Edit Profile
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 text-center"
          >
            <div className="p-4 mb-6 rounded-full bg-gray-700 inline-block">
              <FaSignOutAlt className="text-gray-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">No User Logged In</h2>
            <p className="text-gray-400 mb-6">
              Please login to access your profile and personalized content.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Go to Login
            </Link>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Profile;