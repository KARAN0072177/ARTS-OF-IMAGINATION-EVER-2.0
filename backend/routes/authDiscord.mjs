import express from "express";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import { Strategy as DiscordStrategy } from "passport-discord";
import DiscordUser from "../models/DiscordUser.mjs";
import DiscordLogin from "../models/DiscordLogin.mjs";
import GoogleUser from "../models/GoogleUser.mjs";
import GitHubUser from "../models/GitHubUser.mjs";
import EmailUser from "../models/EmailUser.mjs";
import sendEmail from "../utils/sendEmail.mjs";

dotenv.config();

const router = express.Router();

// ✅ Discord OAuth Strategy
passport.use(
  new DiscordStrategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: process.env.DISCORD_REDIRECT_URI,
      scope: ["identify", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await DiscordUser.findOne({ discordId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        } else {
          const newUser = new DiscordUser({
            discordId: profile.id,
            username: null, // ✅ Ensure username is null initially
            email: profile.email || null,
            avatar: profile.avatar
              ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
              : null,
          });

          await newUser.save();
          return done(null, newUser);
        }
      } catch (error) {
        console.error("❌ Error in Discord OAuth:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ✅ Discord OAuth Routes
router.get("/discord", passport.authenticate("discord"));

router.get(
    "/discord/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    async (req, res) => {
      try {
        if (!req.user) {
          return res.redirect("/");
        }
  
        const { _id: userId, discordId, email, username } = req.user; // ✅ Extract email
        const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const userAgent = req.headers["user-agent"];
  
        if (!username) {
          return res.redirect(`http://localhost:5173/set-username?discordId=${discordId}`);
        }
  
        const existingLogin = await DiscordLogin.findOne({ userId, ipAddress, userAgent });
  
        if (!existingLogin) {
          await DiscordLogin.create({
            userId,
            discordId,
            ipAddress,
            userAgent,
          });
        }
  
        console.log("✅ Discord login recorded.");
  
        // ✅ Send Discord login alert email
        await sendEmail(
          email,
          "🔔 New Discord Login Alert - Arts of Imagination Ever",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
            
            <h2 style="color: #333; text-align: center;">🎮 Discord Login Detected</h2>
  
            <p style="color: #555;">Hi <strong>${username || "User"}</strong>,</p>
  
            <p style="color: #555;">A new login was detected on your account using Discord:</p>
  
            <div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
              <p style="margin: 5px 0;"><strong>📍 IP Address:</strong> ${ipAddress}</p>
              <p style="margin: 5px 0;"><strong>💻 Device:</strong> ${userAgent}</p>
              <p style="margin: 5px 0;"><strong>📅 Date & Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
  
            <p style="color: #555;">If this was <strong>you</strong>, no further action is needed.</p>
  
            <p style="color: red; font-weight: bold;">If this was NOT you, please secure your account immediately!</p>
  
            <p style="text-align: center;">
              <a href="http://localhost:5173/profile" 
                style="color: white; background: red; padding: 12px 20px; text-decoration: none; display: inline-block; border-radius: 5px;">
                🔒 Secure Your Account
              </a>
            </p>
  
            <p style="text-align: center; color: #555;">
              Need help? <a href="http://localhost:5173/contact" style="color: #007bff; text-decoration: none;">Contact Us</a>
            </p>
  
            <p style="text-align: center; font-size: 12px; color: #777;">
              Arts of Imagination Ever | All rights reserved.
            </p>
          </div>
          `
        );
  
        console.log("✅ Discord login email sent to:", email);
  
        res.redirect("http://localhost:5173/discord-success");
  
      } catch (error) {
        console.error("❌ Error in Discord login tracking:", error);
        res.redirect("http://localhost:5173/");
      }
    }
  );  

// ✅ Fetch Discord User Data
router.get("/discord/success", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { discordId, email, username, avatar } = req.user;

  res.json({ discordId, email, username, avatar });
});

// ✅ Set Username Route (After Discord Login)
router.post("/set-username", async (req, res) => {
  const { discordId, username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const user = await DiscordUser.findOne({ discordId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Ensure username is unique across all authentication systems
    const query = { username: { $regex: `^${username}$`, $options: "i" } };

    const usernameExists =
      (await DiscordUser.findOne(query)) ||
      (await GoogleUser.findOne(query)) ||
      (await GitHubUser.findOne(query)) ||
      (await EmailUser.findOne(query));

    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken. Please choose another one." });
    }

    user.username = username;
    await user.save();

    // ✅ Now that the user has a username, track their login
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    if (!user._id) {
      return res.status(500).json({ message: "User ID missing" });
    }

    await DiscordLogin.create({
      userId: user._id, // ✅ Ensure userId is saved properly
      ipAddress,
      userAgent,
    });

    res.json({ message: "Username set successfully" });

  } catch (error) {
    console.error("❌ Error setting username:", error);
    res.status(500).json({ message: "Error setting username" });
  }
});

router.get("/test", (req, res) => {
  res.send("Discord auth route is working!");
});

export default router;