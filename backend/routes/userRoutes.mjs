import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ Correct User Schemas (for Login Data)
const emailLoginSchema = new mongoose.Schema({
  username: String,
  email: String,
  loginMethod: String,
});
const googleLoginSchema = new mongoose.Schema({
  username: String,
  email: String,
  loginMethod: String,
});

// ✅ Correct Models for Login Data
const EmailLogin = mongoose.models.EmailLogin || mongoose.model("EmailLogin", emailLoginSchema, "emaillogin");
const GoogleLogin = mongoose.models.GoogleLogin || mongoose.model("GoogleLogin", googleLoginSchema, "googlelogins");

// ✅ Fetch Profile from `emaillogin`
router.get("/email-profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await EmailLogin.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Fetch Profile from `googlelogins`
router.get("/google-profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await GoogleLogin.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;