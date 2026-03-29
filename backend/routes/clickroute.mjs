import express from "express";
import mongoose from "mongoose";
import Click from "../models/click.mjs"; // Import updated schema
import Image from "../models/Image.mjs";

const router = express.Router();

// Route to log user actions (click, share, download, like)
router.post("/", async (req, res) => {
  console.log("📩 Incoming Request Body:", req.body); // Debug log

  const { userId, imageId, action } = req.body;

  if (!userId || !imageId || !action) {
    console.error("❌ Missing required fields:", req.body);
    return res.status(400).json({ success: false, message: "User ID, Image ID, and action are required." });
  }

  console.log(`🛠 Received action: ${action} for user ${userId}`);

  // Validate action type
  if (!["clicks", "shares", "downloads", "likes"].includes(action)) {
    console.error("❌ Invalid action type:", action);
    return res.status(400).json({ success: false, message: "Invalid action type." });
  }

  try {
    const updateField = action;

    // Add new entry and remove older ones if more than 15 exist
    const clickDoc = await Click.findOneAndUpdate(
      { userId },
      { 
        $push: { 
          [updateField]: { 
            $each: [{ imageId, timestamp: new Date() }], 
            $position: 0, // Add new entry at the beginning
            $slice: 15    // Keep only the last 15
          } 
        } 
      },
      { upsert: true, new: true }
    );

    console.log(`✅ ${action} logged successfully for user ${userId}:`, clickDoc);
    res.status(201).json({ success: true, message: `${action} logged successfully!`, data: clickDoc });
  } catch (error) {
    console.error(`❌ Error logging ${action}:`, error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// ✅ Route to get the last 15 clicked images with details
router.get("/user/:userId/clicks", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user clicks and populate image details
    const userClicks = await Click.findOne({ userId })
      .select("clicks") // Get only clicks array
      .populate({
        path: "clicks.imageId", // Join Image collection
        model: "Image", // Ensure your Image model name matches
        select: "title categories imageUrl", // Select only needed fields
      });

    if (!userClicks) {
      return res.status(404).json({ success: false, message: "No click data found for this user." });
    }

    res.json({ success: true, clicks: userClicks.clicks });
  } catch (error) {
    console.error("❌ Error fetching user clicks:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


export default router;
