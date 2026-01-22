import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import Eye Icons

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false); // State for toggling new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirm password visibility
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      alert("No reset request found. Redirecting...");
      navigate("/username-login"); // Redirect if email is missing
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Password reset successful! Redirecting...");
        localStorage.removeItem("resetEmail"); // Clear reset email from storage
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-black overflow-hidden">
      {/* Custom Glassmorphism Background */}
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-xl"></div>

      {/* Unique Layout for Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-[#121E3A] bg-opacity-80 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl text-[#93C5FD] font-semibold text-center mb-6">Set New Password</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div className="relative">
            <motion.input
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password (6+ chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-[#0A0F1F] text-[#93C5FD] shadow-[0_0_8px_#93C5FD] py-3 px-4 outline-none rounded-lg"
            />
            <span
              onClick={() => setShowNewPassword(!showNewPassword)} // Toggle password visibility
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#93C5FD] cursor-pointer"
            >
              {showNewPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <motion.input
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-[#0A0F1F] text-[#93C5FD] shadow-[0_0_8px_#93C5FD] py-3 px-4 outline-none rounded-lg"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle password visibility
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#93C5FD] cursor-pointer"
            >
              {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </span>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-[#1E40AF] text-[#D1D5DB] py-3 px-4 rounded-lg hover:bg-[#1E3A8A] transition-all duration-200"
          >
            Reset Password
          </motion.button>
        </form>
      </motion.div>

      {/* Glassmorphism Popup for Alerts */}
      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center justify-center z-20"
        >
          <div className="bg-[#121E3A] bg-opacity-90 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-3/4 max-w-md">
            <h3 className="text-lg text-[#93C5FD] font-medium text-center mb-4">{message}</h3>
            <motion.button
              onClick={() => setMessage("")}
              className="w-full bg-[#1E40AF] text-[#D1D5DB] py-2 px-4 rounded-lg hover:bg-[#1E3A8A]"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SetNewPassword;