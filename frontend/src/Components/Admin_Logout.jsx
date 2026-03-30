import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiLogOut, FiAlertTriangle } from "react-icons/fi";
import socket from "../socket";

const Admin_Logout = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("adminName");
    setAdminName(name);
    console.log("Admin Name from localStorage:", name);
  }, []);

  const handleLogout = async () => {
    if (!adminName) {
      alert("No admin logged in! Please log in first.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admins/admin-logout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },

          credentials: "include", // 🔥 IMPORTANT for session logout

          body: JSON.stringify({ adminName }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Emit WebSocket event for real-time logout update
        socket.emit("adminLogout", { adminName });

        // Clear admin session
        localStorage.removeItem("adminName");
        localStorage.removeItem("adminToken");

        navigate("/admin-login");
      } else {
        alert(data.error || "Failed to logout.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Server error! Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-8">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mx-auto w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/30"
          >
            <FiLogOut className="text-red-400 text-4xl" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Logout</h1>
          <p className="text-gray-400">
            {adminName ? `Currently logged in as: ${adminName}` : "No admin session active"}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowConfirm(true)}
          disabled={!adminName}
          className={`px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mx-auto ${adminName
              ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/20"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
        >
          <FiLogOut />
          Logout
        </motion.button>
      </motion.div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700 shadow-xl"
            >
              <div className="flex items-start mb-4">
                <div className="p-2 rounded-full bg-yellow-500/20 mr-3 flex-shrink-0">
                  <FiAlertTriangle className="text-yellow-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Confirm Logout</h3>
                  <p className="text-gray-300">Are you sure you want to logout?</p>
                </div>
              </div>

              <p className="text-red-400 text-sm mb-6 flex items-center gap-2">
                <FiAlertTriangle />
                Your logout status will be recorded in the admin logs
              </p>

              <div className="flex justify-end gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowConfirm(false);
                    handleLogout();
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white transition-colors flex items-center gap-2"
                >
                  <FiLogOut />
                  Confirm Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin_Logout;