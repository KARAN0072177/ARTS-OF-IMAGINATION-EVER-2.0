import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const UsernameLogin = () => {
  const [userInput, setUserInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setMessage("Please enter your username or email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/password/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: userInput }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("OTP sent to your email!");
        localStorage.setItem("resetEmail", userInput);
        window.location.href = "/username-otp";
      } else {
        setMessage(data.message || "Invalid username/email.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="bg-[#121E3A] shadow-lg shadow-blue-900/60 p-6 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl text-[#E5E7EB] font-bold text-center mb-6 tracking-wide">
          Forgot Password
        </h2>

        {/* Single Input */}
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          placeholder="Enter Username or Email"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full bg-[#0A0F1F] text-[#93C5FD] border border-blue-800 focus:ring-2 focus:ring-blue-500 placeholder:text-blue-300 py-2 px-4 rounded-lg outline-none mb-4 transition-all duration-300 shadow-inner shadow-blue-800/40"
        />

        {/* Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[#D1D5DB] mb-4"
          >
            {message}
          </motion.p>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-900/60"
          }`}
        >
          {loading ? "Processing..." : "Send OTP"}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default UsernameLogin;