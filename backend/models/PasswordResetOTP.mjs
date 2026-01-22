import mongoose from "mongoose";

const resetOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // OTP expires in 10 mins
});

// Use a different collection name (password_reset_otps)
export default mongoose.model("PasswordResetOTP", resetOtpSchema);