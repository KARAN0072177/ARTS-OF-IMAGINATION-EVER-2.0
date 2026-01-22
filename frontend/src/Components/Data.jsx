import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { FaUsers, FaImage, FaGoogle, FaGithub, FaDiscord, FaEnvelope, FaChartLine, FaDatabase } from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import Admin_Nav from "./Admin_Nav";

const Data = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin_data/data")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  const statCards = [
    { icon: <FaImage className="text-blue-400" />, label: "Total Images", value: stats?.totalImages },
    { icon: <FaUsers className="text-yellow-400" />, label: "Total Users", value: stats?.totalUsers },
    { icon: <FaEnvelope className="text-pink-400" />, label: "Email Users", value: stats?.emailUsers },
    { icon: <FaGoogle className="text-red-400" />, label: "Google Users", value: stats?.googleUsers },
    { icon: <FaGithub className="text-gray-400" />, label: "GitHub Users", value: stats?.githubUsers },
    { icon: <FaDiscord className="text-indigo-500" />, label: "Discord Users", value: stats?.discordUsers },
  ];

  return (
    <>
      <Admin_Nav />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center px-6 pt-24 pb-12">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-7xl mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                className="text-5xl bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent font-extrabold font-[Cinzel] tracking-wider"
              >
                <Typewriter 
                  words={[
                    "Admin Dashboard",
                    "Platform Analytics",
                    "User Statistics",
                    "Image Insights",
                    "Growth Metrics"
                  ]} 
                  loop 
                  cursor 
                  cursorStyle="_" 
                  typeSpeed={70}
                  deleteSpeed={50} 
                />
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-gray-400 mt-2 text-lg"
              >
                Comprehensive overview of your platform's performance
              </motion.p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:block"
            >
              <RiDashboardFill className="text-6xl text-blue-400 opacity-20" />
            </motion.div>
          </div>

          {/* Tabs */}
          <motion.div className="flex space-x-4 mt-8 border-b border-gray-800">
            {["overview", "users", "images", "analytics"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t-lg font-medium relative ${activeTab === tab ? "text-blue-400" : "text-gray-500 hover:text-gray-300"}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="tabUnderline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Main Content */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { 
                  repeat: Infinity, 
                  duration: 2, 
                  ease: "linear" 
                },
                scale: {
                  repeat: Infinity,
                  duration: 1,
                  repeatType: "reverse"
                }
              }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
            />
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-4 text-gray-400 text-lg"
            >
              Loading platform data...
            </motion.p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-7xl"
          >
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {statCards.map((item, index) => (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, amount: 0.2 }}
                        whileHover={{ y: -10 }}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-800 overflow-hidden relative"
                      >
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500 rounded-full opacity-10" />
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-teal-500 rounded-full opacity-10" />
                        <div className="relative z-10 flex items-center space-x-4">
                          <motion.div 
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse"
                            }}
                            className="p-4 bg-gray-800 rounded-xl shadow-inner"
                          >
                            {item.icon}
                          </motion.div>
                          <div>
                            <h3 className="text-gray-400 text-sm font-medium">{item.label}</h3>
                            <p className="text-3xl font-bold text-white mt-1">{item.value}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-800"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Platform Summary</h3>
                        <FaDatabase className="text-blue-400 text-2xl" />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Images per User</span>
                          <span className="font-bold text-white">
                            {stats && Math.round(stats.totalImages / stats.totalUsers * 10) / 10}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">New Users (7d)</span>
                          <span className="font-bold text-white">Coming Soon</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Active Sessions</span>
                          <span className="font-bold text-white">Coming Soon</span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-800"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Growth Metrics</h3>
                        <FaChartLine className="text-teal-400 text-2xl" />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Daily Growth</span>
                          <span className="font-bold text-white">+2.3%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Weekly Growth</span>
                          <span className="font-bold text-white">+15.7%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Monthly Growth</span>
                          <span className="font-bold text-white">+42.1%</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div
                  key="users"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-800"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">User Analytics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">Authentication Methods</h3>
                      <div className="space-y-4">
                        {[
                          { name: "Email", value: stats?.emailUsers, color: "bg-pink-500" },
                          { name: "Google", value: stats?.googleUsers, color: "bg-red-500" },
                          { name: "GitHub", value: stats?.githubUsers, color: "bg-gray-500" },
                          { name: "Discord", value: stats?.discordUsers, color: "bg-indigo-500" },
                        ].map((item, index) => (
                          <div key={index} className="mb-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-400">{item.name}</span>
                              <span className="text-white">{item.value}</span>
                            </div>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.value / stats.totalUsers) * 100}%` }}
                              transition={{ delay: index * 0.1 + 0.3, duration: 1 }}
                              className={`h-2 rounded-full ${item.color}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">User Activity</h3>
                      <div className="bg-gray-800 rounded-xl p-4 h-full flex items-center justify-center">
                        <motion.p
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-gray-400 text-center"
                        >
                          User activity charts coming soon
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Other tabs would follow the same pattern */}
              {activeTab !== "overview" && activeTab !== "users" && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-12 border border-gray-800 flex flex-col items-center justify-center h-64"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity
                    }}
                    className="text-5xl mb-4 text-blue-400"
                  >
                    {activeTab === "images" ? <FaImage /> : <FaChartLine />}
                  </motion.div>
                  <motion.p
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-xl text-gray-400"
                  >
                    {activeTab === "images" 
                      ? "Image analytics coming soon" 
                      : "Advanced analytics coming soon"}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Data;