import express from "express";
import Click from "../models/click.mjs";
import { scheduleUserRecommendationRefresh } from "../services/recommendationService.mjs";

const router = express.Router();

const VALID_ACTIONS = ["clicks", "shares", "downloads", "likes"];

router.post("/", async (req, res) => {
  const { userId, imageId, action } = req.body;

  if (!userId || !imageId || !action) {
    return res.status(400).json({
      success: false,
      message: "User ID, Image ID, and action are required.",
    });
  }

  if (!VALID_ACTIONS.includes(action)) {
    return res.status(400).json({ success: false, message: "Invalid action type." });
  }

  try {
    const clickDoc = await Click.findOneAndUpdate(
      { userId },
      {
        $push: {
          [action]: {
            $each: [{ imageId, timestamp: new Date() }],
            $position: 0,
            $slice: 15,
          },
        },
      },
      { upsert: true, new: true }
    );

    scheduleUserRecommendationRefresh(userId);

    return res.status(201).json({
      success: true,
      message: `${action} logged successfully!`,
      data: clickDoc,
    });
  } catch (error) {
    console.error(`Error logging ${action}:`, error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/user/:userId/clicks", async (req, res) => {
  try {
    const { userId } = req.params;
    const userClicks = await Click.findOne({ userId }).select("clicks").lean();

    if (!userClicks) {
      return res.status(404).json({
        success: false,
        message: "No click data found for this user.",
      });
    }

    return res.json({ success: true, clicks: userClicks.clicks });
  } catch (error) {
    console.error("Error fetching user clicks:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
