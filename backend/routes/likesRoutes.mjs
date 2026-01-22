import express from "express";
import Like from "../models/Likes.mjs";
import mongoose from "mongoose";

const router = express.Router();

/**
 * @route   POST /api/likes/toggle
 * @desc    Toggle like (like/unlike) an image
 * @access  Public (but requires logged-in user)
 */
router.post("/toggle", async (req, res) => {
    try {
        let { userId, githubId, discordId, imageId } = req.body; // ✅ Added `discordId`

        if ((!userId && !githubId && !discordId) || !imageId) {
            return res.status(400).json({ message: "User ID (or GitHub/Discord ID) and Image ID are required." });
        }

        const query = { 
            imageId, 
            $or: [
                { userId }, 
                { userId: githubId }, 
                { userId: discordId } // ✅ Check for Discord ID as well
            ] 
        };

        const existingLike = await Like.findOne(query);

        if (existingLike) {
            // Unlike if already liked
            await Like.deleteOne(query);
        } else {
            // Like if not already liked
            await Like.create({ userId: userId || githubId || discordId, imageId }); // ✅ Store discordId if others are missing
        }

        const likeCount = await Like.countDocuments({ imageId });
        return res.json({ liked: !existingLike, likeCount });

    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * @route   GET /api/likes/count/:imageId
 * @desc    Get the number of likes for an image
 * @access  Public
 */
router.get("/count/:imageId", async (req, res) => {
    try {
        const { imageId } = req.params;
        const { userId, githubId, discordId } = req.query; // ✅ Accepting `discordId`

        // Count total likes
        const likeCount = await Like.countDocuments({ imageId });

        // Check if the current user (or GitHub/Discord user) has liked the image
        const query = { 
            imageId, 
            $or: [
                { userId }, 
                { userId: githubId }, 
                { userId: discordId } // ✅ Check for Discord user as well
            ] 
        };
        const userLiked = (userId || githubId || discordId) ? await Like.exists(query) : false;

        res.json({ likeCount, userLiked: !!userLiked });

    } catch (error) {
        console.error("Error fetching like count:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;