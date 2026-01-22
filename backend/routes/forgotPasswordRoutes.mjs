import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import User from "../models/User.mjs"; // Import the user schema
import PasswordResetOTP from "../models/PasswordResetOTP.mjs";

dotenv.config();
const router = express.Router();

// ✅ Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Step 1: Request Password Reset (Send OTP)
router.post("/request-reset", async (req, res) => {
  const { identifier } = req.body; // Can be email or username

  try {
    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      console.log(`❌ User not found for identifier: ${identifier}`);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in the database (expires in 10 minutes)
    await PasswordResetOTP.create({ email: user.email, otp });

    console.log(`✅ Generated OTP for ${user.email}: ${otp}`);

// Send OTP via email with professional styling
await transporter.sendMail({
  from: `"Support Team" <${process.env.EMAIL_USER}>`,
  to: user.email,
  subject: "🔐 Password Reset OTP - Secure Your Account",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="color: #333; text-align: center;">🔑 Password Reset Request</h2>
      <p style="color: #555;">Dear <strong>${user.email}</strong>,</p>
      <p style="color: #555;">We received a request to reset your password. Use the OTP below to proceed:</p>
      <div style="text-align: center; font-size: 22px; font-weight: bold; color: #007bff; padding: 15px; background: #fff; border-radius: 8px; border: 1px solid #ddd; display: inline-block;">
        ${otp}
      </div>
      <p style="color: #555;">This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #888; font-size: 12px; text-align: center;">⚠ Please do not share this OTP with anyone for security reasons.</p>
      <p style="color: #888; font-size: 12px; text-align: center;">If you need assistance, contact our <a href="mailto:support@example.com" style="color: #007bff; text-decoration: none;">support team</a>.</p>
    </div>
  `,
});

    res.json({ success: true, message: "OTP sent to email" });

  } catch (error) {
    console.error("🚨 Error in password reset request:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Step 2: Verify OTP
router.post("/verify-reset-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Fetch the most recent OTP Record by Email
    const otpRecord = await PasswordResetOTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      console.log(`❌ No OTP record found for ${email}`);
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    console.log(`🔍 Checking OTP for ${email} - Entered: ${otp}, Expected: ${otpRecord.otp}`);

    if (otpRecord.otp !== otp) {
      console.log(`❌ OTP mismatch for ${email}`);
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // ✅ OTP is valid, allow user to reset password
    console.log(`✅ OTP verified for ${email}`);
    res.json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    console.error("🚨 Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Step 3: Reset Password
router.post("/reset-password", async (req, res) => {
  console.log("Received reset-password request:", req.body);

  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    console.error("❌ Missing email or newPassword in request body");
    return res.status(400).json({ success: false, message: "Email and new password are required" });
  }

  try {
    console.log(`🔄 Resetting password for ${email}`);

    // Find the user from the email_users collection
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`❌ No user found for email: ${email}`);
      return res.status(400).json({ success: false, message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("🔑 New Hashed Password:", hashedPassword);

    // Update the user's password using findOneAndUpdate
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedUser) {
      console.error("❌ Password update failed in MongoDB");
      return res.status(500).json({ success: false, message: "Password update failed" });
    }

    console.log(`✅ Password reset successfully for ${email}. Updated Hash: ${updatedUser.password}`);

    // Immediately re-query the user to confirm the update
    const checkUser = await User.findOne({ email });
    console.log("🔎 User document after update:", checkUser);

    // Remove OTP record
    await PasswordResetOTP.deleteOne({ email });

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;