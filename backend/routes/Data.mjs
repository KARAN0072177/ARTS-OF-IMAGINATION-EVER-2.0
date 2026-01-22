import express from "express";
import Upload from "../models/Upload.mjs"; // Image uploads collection
import EmailUser from "../models/User.mjs"; // Email-based users
import GoogleUser from "../models/GoogleUser.mjs"; // Google users
import GitHubUser from "../models/GitHubUser.mjs"; // GitHub users
import DiscordUser from "../models/DiscordUser.mjs"; // Discord users

const router = express.Router();

// Route to get statistics
router.get("/data", async (req, res) => {
  try {
    const totalImages = await Upload.countDocuments();
    const emailUsers = await EmailUser.countDocuments();
    const googleUsers = await GoogleUser.countDocuments();
    const githubUsers = await GitHubUser.countDocuments();
    const discordUsers = await DiscordUser.countDocuments();

    const totalUsers = emailUsers + googleUsers + githubUsers + discordUsers;

    res.json({
      totalImages,
      totalUsers,
      emailUsers,
      googleUsers,
      githubUsers,
      discordUsers,
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;