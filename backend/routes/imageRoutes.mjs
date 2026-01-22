import express from "express";
import Image from "../models/Image.mjs"; // Ensure this model exists

const router = express.Router();

// Get all images
router.get("/", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;