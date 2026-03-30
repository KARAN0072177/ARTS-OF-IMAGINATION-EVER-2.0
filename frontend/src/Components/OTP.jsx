import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function OTP() {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  const { email, username, password } = location.state || {};

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const updated = [...otpDigits];
      updated[index] = value;
      setOtpDigits(updated);

      // Move to next input if current filled
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/verify-otp`,
        {
          method: "POST",
          credentials: "include", // Important for session handling
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, password, otp }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-[#121E3A] p-6 rounded-lg shadow-lg w-full max-w-md backdrop-blur-md bg-opacity-40">
        <h2 className="text-2xl font-bold text-[#E5E7EB] text-center mb-4">Enter OTP</h2>
        <p className="text-[#D1D5DB] text-center mb-4">
          We've sent a 6-digit OTP to your email.
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              type="tel"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center text-xl bg-[#0A0F1F] text-[#93C5FD] border rounded-lg shadow-[0_0_6px_#93C5FD] focus:ring-2 focus:ring-blue-500 transition"
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg mt-4 ${loading ? "bg-gray-400" : "bg-[#1E40AF] hover:bg-[#1E3A8A] text-[#D1D5DB]"
            }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>

      {/* Error Modal */}
      {error && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <div className="bg-[#121E3A] bg-opacity-80 p-8 rounded-lg shadow-lg backdrop-blur-md">
            <h3 className="text-xl text-red-500 text-center mb-4">{error}</h3>
            <button
              onClick={() => setError("")}
              className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white py-2 px-4 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {success && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <div className="bg-[#121E3A] bg-opacity-80 p-8 rounded-lg shadow-lg backdrop-blur-md">
            <h3 className="text-xl text-green-500 text-center mb-4">OTP Verified Successfully!</h3>
            <button
              onClick={() => setSuccess(false)}
              className="bg-[#1E40AF] hover:bg-[#1E3A8A] text-white py-2 px-4 rounded-lg w-full"
            >
              Redirecting...
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OTP;