import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaReceipt, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaLink, 
  FaCheckCircle, 
  FaTimesCircle,
  FaCreditCard,
  FaUser,
  FaEnvelope,
  FaSignInAlt
} from "react-icons/fa";
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));
  const authMethod = localStorage.getItem("loginMethod");
  const userId =
    authMethod === "google"
      ? user?.googleId
      : authMethod === "github"
        ? user?.githubId
        : authMethod === "discord"
          ? user?.discordId
          : user?.email;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/payments/history/${authMethod}/${userId}`
        );
        // Ensure all entries have a status, defaulting to "succeeded"
        const processedHistory = response.data.map(item => ({
          ...item,
          status: item.status || "succeeded"
        }));
        setHistory(processedHistory);
      } catch (err) {
        console.error("⚠️ Error fetching payment history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authMethod && userId) {
      fetchHistory();
    }
  }, [authMethod, userId]);

  const filteredHistory = activeFilter === "all" 
    ? history 
    : history.filter(item => item.status === activeFilter);

  // Count successful payments (status === "succeeded")
  const successfulPaymentsCount = history.filter(item => item.status === "succeeded").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 px-6 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-block p-4 mb-6 rounded-full bg-gradient-to-r from-blue-600 to-teal-500">
            <FaReceipt className="text-white text-4xl" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent mb-2">
            No Purchases Yet
          </h2>
          <p className="text-gray-400 text-lg">
            Your collection of premium gems is waiting to be discovered 💎
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Explore Premium Content
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Purchase History | ARTS OF IMAGINATION EVER</title>
        <meta name="description" content="View your purchase history on ARTS OF IMAGINATION EVER. Check the details of your past transactions and premium image downloads." />
        <meta property="og:title" content="Purchase History | ARTS OF IMAGINATION EVER" />
        <meta property="og:description" content="View your purchase history on ARTS OF IMAGINATION EVER. Check the details of your past transactions and premium image downloads." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0f0f0f] to-gray-900 py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent mb-4">
              Your Purchase History
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              All your premium purchases in one place. Track, manage, and revisit your collection.
            </p>
          </div>

          {/* Filter buttons - Only show if there are different statuses */}
          {new Set(history.map(item => item.status)).size > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === "all" ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                All Purchases
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter("succeeded")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === "succeeded" ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                Successful
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveFilter("failed")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === "failed" ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                Failed
              </motion.button>
            </div>
          )}

          {/* Stats summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Purchases</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{history.length}</h3>
                </div>
                <div className="p-3 rounded-full bg-blue-500/20">
                  <FaReceipt className="text-blue-400 text-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Spent</p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    ${history.reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2)}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-green-500/20">
                  <FaDollarSign className="text-green-400 text-xl" />
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Successful Payments</p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {successfulPaymentsCount}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-teal-500/20">
                  <FaCheckCircle className="text-teal-400 text-xl" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Purchase cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHistory.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-700/50 hover:border-teal-400/30 transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        entry.status === "succeeded" 
                          ? 'bg-green-900/50 text-green-400' 
                          : 'bg-red-900/50 text-red-400'
                      }`}>
                        {entry.status === "succeeded" ? (
                          <FaCheckCircle className="mr-1" />
                        ) : (
                          <FaTimesCircle className="mr-1" />
                        )}
                        {entry.status}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{entry.product}</h3>
                  
                  <div className="flex items-center text-2xl font-bold text-teal-400 mb-6">
                    <FaDollarSign className="mr-1 text-base" />
                    {Number(entry.amount).toFixed(2)}
                    <span className="ml-1 text-sm text-gray-400">{entry.currency?.toUpperCase()}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-300">
                      <FaUser className="mr-2 text-gray-400" />
                      <span>{entry.username}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <FaEnvelope className="mr-2 text-gray-400" />
                      <span>{entry.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <FaSignInAlt className="mr-2 text-gray-400" />
                      <span className="capitalize">{entry.authMethod}</span>
                    </div>
                    {entry.method && (
                      <div className="flex items-center text-sm text-gray-300">
                        <FaCreditCard className="mr-2 text-gray-400" />
                        <span className="capitalize">{entry.method}</span>
                      </div>
                    )}
                  </div>

                  {entry.receipt_url && (
                    <motion.a
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      href={entry.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center justify-center w-full py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-all text-sm font-medium"
                    >
                      <FaLink className="mr-2" />
                      View Receipt
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PurchaseHistory;