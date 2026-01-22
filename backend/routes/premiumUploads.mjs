import express from "express";
import PremiumUpload from "../models/premiumUploadModel.mjs";

const router = express.Router();

// ✅ POST - Upload a new premium image
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      author,
      imageUrl,
      category,
      resolution2k,
      resolution4k,
      resolution8k,
    } = req.body;

    // Required fields check
    if (!title || !description || !author || !imageUrl || !category?.length) {
      return res.status(400).json({ message: "All basic fields are required." });
    }

    // At least one resolution must be provided
    if (!resolution2k && !resolution4k && !resolution8k) {
      return res.status(400).json({
        message: "At least one resolution URL (2K, 4K, or 8K) is required.",
      });
    }

    const newUpload = new PremiumUpload({
      title,
      description,
      author,
      imageUrl,
      category,
      resolution2k: resolution2k || null,
      resolution4k: resolution4k || null,
      resolution8k: resolution8k || null,
    });

    await newUpload.save();

    res.status(201).json({ message: "Premium image uploaded successfully!" });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Server error while uploading." });
  }
});

// ✅ GET - Fetch all premium uploads
router.get("/", async (req, res) => {
  try {
    const uploads = await PremiumUpload.find().sort({ timestamp: -1 });
    res.json(uploads);
  } catch (error) {
    console.error("❌ Fetch error:", error);
    res.status(500).json({ message: "Server error while fetching uploads." });
  }
});

export default router ;