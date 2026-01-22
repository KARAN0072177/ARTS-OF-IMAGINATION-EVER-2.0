import express from "express";
import { body, validationResult } from "express-validator";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Define Newsletter Schema & Model
const newsletterSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
});

const NewsletterUser = mongoose.model("NewsletterUser", newsletterSchema);

// ✅ Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Newsletter Subscription API
router.post(
  "/subscribe",
  [body("email").isEmail().withMessage("Invalid email format")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Please enter a valid email." });
    }

    const { email } = req.body;

    try {
      // Check if email already exists in Newsletter collection
      const existingUser = await NewsletterUser.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already subscribed." });
      }

      // Store new email in Newsletter collection
      await NewsletterUser.create({ email });

      // 🎨 **HTML Email Template for User**
      const userEmailHTML = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #007bff;">🎉 Thank You for Subscribing! 🎉</h2>
          <p style="font-size: 16px; color: #333;">
            You have successfully subscribed to our newsletter. Stay tuned for updates!
          </p>
          <div style="margin-top: 20px;">
            <a href="http://localhost:5173" 
               style="background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 15px; border-radius: 5px;">
               Visit Our Website
            </a>
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #777;">
            If you did not subscribe, please ignore this email.
          </p>
        </div>
      `;

      // 📩 **Email Template for Admin Notification**
      const adminEmailHTML = `
        <div style="font-family: Arial, sans-serif; text-align: left; padding: 20px;">
          <h2 style="color: #28a745;">📢 New Newsletter Subscription</h2>
          <p style="font-size: 16px; color: #333;">
            A new user has subscribed to the newsletter.
          </p>
          <p><strong>Email:</strong> ${email}</p>
          <p style="font-size: 14px; color: #777;">Check your database for more details.</p>
        </div>
      `;

      // ✅ Send Confirmation Email to User
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "🎉 Newsletter Subscription Confirmed!",
        html: userEmailHTML,
      });

      // ✅ Send Admin Notification Email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Admin Email
        subject: "📩 New Newsletter Subscriber!",
        html: adminEmailHTML,
      });

      res.json({ message: "Subscription successful! Check your email." });
    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({ message: "Server error, please try again later." });
    }
  }
);

export default router;