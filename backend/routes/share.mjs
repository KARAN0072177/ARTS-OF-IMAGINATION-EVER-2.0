import express from "express";
import { v4 as uuidv4 } from "uuid";
import SharedLink from "../models/shared_links.mjs";


const router = express.Router();

// POST /api/share
router.post("/", async (req, res) => {
  const { imageId } = req.body;

  if (!imageId) {
    return res.status(400).json({ message: "Image ID is required." });
  }

  try {
    const token = uuidv4();

    const newLink = new SharedLink({ token, imageId });
    await newLink.save();

    const shareUrl = `http://localhost:5173/pgallery/${token}`;
    res.status(200).json({ shareUrl });
  } catch (error) {
    console.error("Error generating share link:", error);
    res.status(500).json({ message: "Server error." });
  }
});


// GET /api/share/:token
router.get("/:token", async (req, res) => {
    const { token } = req.params;
  
    try {
      const sharedLink = await SharedLink.findOne({ token }).populate("imageId");
      if (!sharedLink) return res.status(404).json({ message: "Link not found or expired." });
  
      res.status(200).json({ image: sharedLink.imageId });
    } catch (err) {
      console.error("Error fetching shared image:", err);
      res.status(500).json({ message: "Server error." });
    }
  });
  
export default router;