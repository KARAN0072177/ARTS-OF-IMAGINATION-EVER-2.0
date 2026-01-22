import express from "express";
import DiscordUser from "../models/DiscordUser.mjs";
import GoogleUser from "../models/GoogleUser.mjs";
import GitHubUser from "../models/GitHubUser.mjs";
import EmailUser from "../models/EmailUser.mjs";

const router = express.Router();

// Route: GET /api/profile/:method/:userId
router.get("/:method/:userId", async (req, res) => {
  const { method, userId } = req.params;

  try {
    let profile = null;

    if (method === "google") {
      profile = await GoogleUser.findOne({ googleId: userId });
      if (profile) {
        return res.json({
          username: profile.username,
          email: profile.email,
          avatar: profile.picture?.startsWith("http")
  ? profile.picture
  : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username || "User")}&background=0D8ABC&color=fff`,
        });
      }
    } else if (method === "github") {
      profile = await GitHubUser.findOne({ githubId: userId });
      if (profile) {
        return res.json({
          username: profile.username,
          email: profile.email,
          avatar: profile.avatar || null,
        });
      }
    } else if (method === "discord") {
      profile = await DiscordUser.findOne({ discordId: userId });
      if (profile) {
        return res.json({
          username: profile.username,
          email: profile.email,
          avatar: profile.avatar || null,
        });
      }
    } else if (method === "email") {
      profile = await EmailUser.findOne({ email: userId });
      if (profile) {
        return res.json({
          username: profile.username,
          email: profile.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.username || "User"
          )}&background=0D8ABC&color=fff`,
        });
      }
    } else {
      return res.status(400).json({ error: "Invalid login method" });
    }

    res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;