import bcrypt from "bcrypt";
import express from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import EmailLogin from "../models/EmailUser.mjs"; // ✅ Import login tracking schema
import sendEmail from "../utils/sendEmail.mjs";
import GoogleUser from "../models/GoogleUser.mjs";   // Adjust path if needed
import GitHubUser from "../models/GitHubUser.mjs";   // Adjust path if needed
import DiscordUser from "../models/DiscordUser.mjs"; // Adjust path if needed

dotenv.config(); // Load environment variables

const router = express.Router();

import User from "../models/User.mjs";

// ✅ Define OTP Verification Schema
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Auto-delete after 10 mins
});

const OTPVerification = mongoose.model("OTPVerification", otpSchema, "otp_verifications");

// ✅ Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Register Route (Sends OTP)
router.post("/register", async (req, res) => {
  console.log("Received registration request:", req.body);

  const { username, email, password } = req.body;

  // Check if username already exists in any collection
  const usernameExistsInEmail = await User.findOne({ username });
  const usernameExistsInGoogle = await GoogleUser.findOne({ username });
  const usernameExistsInGitHub = await GitHubUser.findOne({ username });
  const usernameExistsInDiscord = await DiscordUser.findOne({ username });

  if (usernameExistsInEmail || usernameExistsInGoogle || usernameExistsInGitHub || usernameExistsInDiscord) {
    return res.status(400).json({ success: false, message: "Username already taken. Please choose a different username." });
  }


  // Basic Validation
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in Database
    await OTPVerification.findOneAndUpdate(
      { email }, 
      { otp, createdAt: new Date() }, 
      { upsert: true, new: true }
    );    

    console.log(`Generated OTP for ${email}: ${otp}`);

    // Send OTP via Email
    try {
      // Send OTP for registration with professional styling
      await transporter.sendMail({
        from: `"Support Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🔑 Your OTP Code for Registration",
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="color: #333; text-align: center;">🔐 Secure Your Registration</h2>
      <p style="color: #555;">Dear User,</p>
      <p style="color: #555;">Thank you for signing up! Use the OTP below to complete your registration:</p>
      <div style="text-align: center; font-size: 22px; font-weight: bold; color: #007bff; padding: 15px; background: #fff; border-radius: 8px; border: 1px solid #ddd; display: inline-block;">
        ${otp}
      </div>
      <p style="color: #555;">This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #888; font-size: 12px; text-align: center;">⚠ Please do not share this OTP with anyone for security reasons.</p>
      <p style="color: #888; font-size: 12px; text-align: center;">If you need help, contact our <a href="mailto:support@example.com" style="color: #007bff; text-decoration: none;">support team</a>.</p>
    </div>
  `,
      });

    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      return res.status(500).json({ success: false, message: "Failed to send OTP email" });
    }

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Error in Register Route:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Verify OTP Route
// ✅ Verify OTP Route
router.post("/verify-otp", async (req, res) => {
  const { username, email, password, otp } = req.body;

  console.log(`Verifying OTP for ${email}: ${otp}`);

  try {
    // Fetch the most recent OTP Record by Email
    const otpRecord = await OTPVerification.findOne({ email }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    console.log(`Stored OTP in DB: ${otpRecord.otp}, Entered OTP: ${otp}`);

    // Check if OTP is correct
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // ✅ **Check if user already exists before creating a new one**
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`⚠️ User ${email} already exists. Skipping registration.`);
      return res.status(400).json({ success: false, message: "User already registered. Please log in." });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`🔐 Hashed Password Before Saving: ${hashedPassword}`);

    // ✅ Save User only if they don't exist
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log(`✅ User registered: ${username}, Email: ${email}`);

    // Delete OTP Record
    await OTPVerification.deleteOne({ email });

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error in Verify OTP Route:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Manual Login Route (Now Stores Logins)
// ✅ Manual Login Route (Fixing Password Check)

// Manual Login Route
router.post("/auth/login", async (req, res) => {
  console.log("Received login request:", req.body);

  const { username, email, password } = req.body;
  console.log(`Login attempt: Username: ${username}, Email: ${email}`);

  try {
    // Find user by username OR email
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      console.log("User not found in database.");
      return res.status(400).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    console.log(`📩 Received login request:`, req.body);
    console.log(`🔎 Stored Hash in DB: ${user.password}`);
    console.log(`🔑 Entered Password Before Trim: "${password}"`);
    console.log(`🔑 Entered Password After Trim: "${password.trim()}"`);

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log(`✅ Password Match Result: ${isMatch}`);

    if (!isMatch) {
      console.log("❌ Password incorrect!");
      return res.status(400).json({ success: false, message: "❌ Incorrect password. Please try again." });
    }

    console.log(`User ${username} logged in successfully.`);

    // ✅ Get user IP and device details
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    // ✅ Store login attempt in "emaillogin" collection
   // ✅ Store login attempt in "emaillogin" collection (Prevent Duplicates)
   await EmailLogin.findOneAndUpdate(
    { email: user.email },
    { 
      username: user.username, 
      email: user.email, 
      loginTime: new Date(), // ✅ Use loginTime instead
      ipAddress, 
      userAgent 
    }, 
    { upsert: true, new: true }
  );  

    // ✅ Send login alert email
    await sendEmail(
      user.email,
      "🔔 New Login Alert - Arts of Imagination Ever",
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">🔔 New Login Detected</h2>
        <p style="color: #555;">Hi <strong>${user.username || "User"}</strong>,</p>
        <p style="color: #555;">We noticed a new login to your account:</p>
        <div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
          <p style="margin: 5px 0;"><strong>📍 IP Address:</strong> ${ipAddress}</p>
          <p style="margin: 5px 0;"><strong>💻 Device:</strong> ${userAgent}</p>
          <p style="margin: 5px 0;"><strong>📅 Date & Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <p style="color: #555;">If this was <strong>you</strong>, no further action is needed.</p>
        <p style="color: red; font-weight: bold;">If this was NOT you, please secure your account immediately!</p>
        <p style="text-align: center;">
          <a href="http://localhost:5173/profile" 
            style="color: white; background: red; padding: 12px 20px; text-decoration: none; display: inline-block; border-radius: 5px;">
            🔒 Secure Your Account
          </a>
        </p>
        <p style="text-align: center; color: #555;">
          Need help? <a href="http://localhost:5173/contact" style="color: #007bff; text-decoration: none;">Contact Us</a>
        </p>
        <p style="text-align: center; font-size: 12px; color: #777;">
          Arts of Imagination Ever | All rights reserved.
        </p>
      </div>
      `
    );

    // **Create a session manually** (this replaces passport session handling)
    req.session.userId = user._id;  // Store the user ID in the session
    req.session.username = user.username;  // Store the username in the session
    req.session.email = user.email;  // Store the email in the session

    // Respond with success
    res.json({ success: true, message: "Login successful", user });
  } catch (error) {
    console.error("Login Error:", error);

    // Handle bcrypt-specific errors (if any)
    if (error instanceof bcrypt.BcryptError) {
      return res.status(400).json({ success: false, message: "Password comparison error" });
    }

    // Handle all other errors
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

export default router;