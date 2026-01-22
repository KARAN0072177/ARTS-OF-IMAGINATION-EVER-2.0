import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ParticlesBg from "particles-bg";

const UsernameOtp = () => {
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleOtpSubmit = async () => {
    const otp = otpArray.join("");

    if (otp.length !== 6) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true); // Start loading state
    try {
      const response = await fetch("http://localhost:5000/api/password/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: localStorage.getItem("resetEmail"), otp }),
      });

      const data = await response.json();
      if (data.success) {
        setModalMessage("OTP verified! Proceed to set a new password.");
        setModalVisible(true);
        setTimeout(() => navigate("/newpass"), 2000); // Redirect after delay
      } else {
        setModalMessage(data.message || "Invalid OTP. Please try again.");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setModalMessage("Something went wrong. Try again.");
      setModalVisible(true);
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Custom loader component
  const Loader = () => (
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  );

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      <ParticlesBg type="cobweb" bg={true} color="#3B82F6" />

      {/* Glow Effects */}
      <div className="absolute w-80 h-80 bg-blue-700 rounded-full opacity-30 blur-3xl animate-pulse top-10 left-20 z-0" />
      <div className="absolute w-80 h-80 bg-indigo-600 rounded-full opacity-30 blur-2xl animate-pulse bottom-20 right-10 z-0" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-[#121E3A] relative z-10 shadow-xl shadow-blue-900/60 px-6 py-8 rounded-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center text-[#E5E7EB] mb-3">
          OTP Verification
        </h2>
        <p className="text-center text-[#9CA3AF] mb-6">
          We've sent a 6-digit OTP to your email address.
        </p>

        <AnimatePresence>
          <motion.div
            key={shake ? "shake" : "stable"}
            initial={shake ? { x: -10 } : false}
            animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="flex justify-between gap-2 mb-4"
          >
            {otpArray.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-12 h-12 text-center text-xl rounded-md bg-[#0A0F1F] text-[#93C5FD] shadow-[0_0_6px_#93C5FD] outline-none transition-transform duration-200 focus:scale-110"
              />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleOtpSubmit}
          disabled={loading}
          className={`w-full py-2 rounded-xl text-lg font-medium transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#1E40AF] hover:bg-[#1E3A8A] text-[#D1D5DB] shadow-md hover:shadow-blue-700/50"
          }`}
        >
          {loading ? <Loader /> : "Verify OTP"}
        </motion.button>
      </motion.div>

      {/* Glassmorphism Modal */}
      {modalVisible && (
        <div className="absolute inset-0 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/20 backdrop-blur-md border border-[#ffffff33] rounded-2xl p-6 shadow-lg w-80 text-center"
          >
            <h3 className="text-lg text-white font-semibold">{modalMessage}</h3>
            <button
              onClick={() => setModalVisible(false)}
              className="mt-4 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white py-2 px-4 rounded-xl"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UsernameOtp;