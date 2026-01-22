import express from "express";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Contact Us API Route
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    try {
      // ✅ Email Template (Styled)
      const emailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Thank You for Contacting Us!</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>We appreciate you reaching out to us. Our team has received your message and will get back to you as soon as possible.</p>
          <div style="background: #f4f4f4; padding: 10px; border-radius: 5px; margin-top: 10px;">
            <p><strong>Your Message:</strong></p>
            <p style="font-style: italic;">"${message}"</p>
          </div>
          <p>For urgent queries, feel free to reply to this email.</p>
          <p>Best Regards,<br><strong>ARTS OF IMAGINATION EVER Team</strong></p>
        </div>
      `;

      // ✅ Send confirmation email to user
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Message Has Been Received - ARTS OF IMAGINATION",
        html: emailTemplate,
      });

      // ✅ Email to Admin
      const adminTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <div style="background: #f4f4f4; padding: 10px; border-radius: 5px; margin-top: 10px;">
            <p><strong>Message:</strong></p>
            <p style="font-style: italic;">"${message}"</p>
          </div>
          <p>Please respond to the user as soon as possible.</p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Admin Email
        subject: `New Contact Inquiry from ${name}`,
        html: adminTemplate,
      });

      res.json({ message: "Your message has been successfully sent!" });
    } catch (error) {
      console.error("❌ Error sending email:", error);
      res.status(500).json({ message: "Error sending the message." });
    }
  }
);

export default router;