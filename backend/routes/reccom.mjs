import express from "express";
import Upload from "../models/Upload.mjs";
import {
  getRecommendationLimit,
  getRecommendationsForUser,
} from "../services/recommendationService.mjs";
import { addThumbnailUrl } from "../services/thumbnailService.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (userId) {
      const recommended = await getRecommendationsForUser(userId);

      if (recommended?.images?.length) {
        return res.json(recommended);
      }
    }

    const allImages = await Upload.find()
      .sort({ createdAt: -1 })
      .limit(getRecommendationLimit())
      .lean();

    return res.json({ images: allImages.map(addThumbnailUrl), source: "uploads" });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
