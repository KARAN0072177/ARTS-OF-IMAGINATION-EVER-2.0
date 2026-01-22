import express from "express";
import Reccom from "../models/Reccom.mjs";
import Upload from "../models/Upload.mjs";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      console.log("⛔ No user logged in. Fetching from uploads.");
      const allImages = await Upload.find();
      return res.json({ images: allImages, source: "uploads" });
    }

    console.log(`🔍 Searching for recommendations with userId: '${userId}'`);

    // ✅ Log all stored userIds in Reccom collection for debugging
    const allUsers = await Reccom.find({}, { userId: 1, _id: 0 });
    console.log("📌 All stored userIds in Reccom:", allUsers.map(u => u.userId));

    // ✅ Convert userId to string to avoid ObjectId mismatch
    const reccomData = await Reccom.findOne({ userId: userId.toString() });

    console.log(`🔎 MongoDB Query Result:`, reccomData); // Debugging

    if (!reccomData || !reccomData.images || reccomData.images.length === 0) {
      console.log(`⚠️ No recommendations found for userId: ${userId}, fetching from uploads.`);
      const allImages = await Upload.find();
      return res.json({ images: allImages, source: "uploads" });
    }

    console.log(`✅ Found ${reccomData.images.length} recommended images for userId: ${userId}`);
    return res.json({ images: reccomData.images, source: "reccom" });

  } catch (error) {
    console.error("❌ Error fetching images:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
