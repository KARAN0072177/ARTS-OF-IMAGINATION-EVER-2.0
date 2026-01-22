import express from "express";
import Like from "../models/Likes.mjs";
import Upload from "../models/Upload.mjs";

const router = express.Router();

// Route: GET /api/liked-images/:userId
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const likes = await Like.find({ userId });

    const imageIds = likes.map((like) => like.imageId);

    const likedImages = await Upload.find({ _id: { $in: imageIds } });

    res.json(likedImages);
  } catch (error) {
    console.error("Error fetching liked images:", error);
    res.status(500).json({ error: "Failed to fetch liked images" });
  }
});

export default router;