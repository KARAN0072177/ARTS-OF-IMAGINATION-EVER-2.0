import express from "express";
import passport from "passport";
import GitHubStrategy from "passport-github2";
import GitHubUser from "../models/GitHubUser.mjs";
import GitHubLogin from "../models/GitHubLogin.mjs";
import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.mjs";
import EmailUser from "../models/EmailUser.mjs";
import GoogleUser from "../models/GoogleUser.mjs";
import DiscordUser from "../models/DiscordUser.mjs";

dotenv.config();

const router = express.Router();

// ✅ GitHub OAuth Passport Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"], // Request access to email
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await GitHubUser.findOne({ githubId: profile.id });

        if (!user) {
          user = new GitHubUser({
            githubId: profile.id,
            email: profile.emails?.[0]?.value || null, // GitHub may not return an email
            username: null, // ✅ Ensure username is null initially
            avatar: profile.photos?.[0]?.value || null,
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("❌ Error in GitHub OAuth:", error);
        done(error, null);
      }
    }
  )
);

// ✅ Serialize and Deserialize User
passport.serializeUser((user, done) => done(null, user.githubId));
passport.deserializeUser(async (githubId, done) => {
  try {
    const user = await GitHubUser.findOne({ githubId });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// ✅ GitHub OAuth Routes
router.get("/auth", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/auth/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect("/");
      }

      const { githubId, email, username } = req.user;
      const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];

      if (!username) {
        return res.redirect(`http://localhost:4173/set-username?githubId=${githubId}`);
      }

      const existingLogin = await GitHubLogin.findOne({ githubId, ipAddress, userAgent });

      if (!existingLogin) {
        await GitHubLogin.create({
          githubId,
          email,
          username,
          ipAddress,
          userAgent,
        });
      }

      // ✅ Send GitHub login alert email
      await sendEmail(
        email,
        "🔔 New GitHub Login Alert - Arts of Imagination Ever",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
          
          <h2 style="color: #333; text-align: center;">🐙 GitHub Login Detected</h2>

          <p style="color: #555;">Hi <strong>${username || "User"}</strong>,</p>

          <p style="color: #555;">A new login was detected on your account using GitHub:</p>

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

      console.log("✅ GitHub login email sent to:", email);

      res.redirect("http://localhost:4173/github-success");
    } catch (error) {
      console.error("❌ Error in GitHub login tracking:", error);
      res.redirect("/");
    }
  }
);

// ✅ API Route to Fetch GitHub User Data (Session-Based Authentication)
router.get("/auth/success", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await GitHubUser.findOne({ githubId: req.user.githubId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ githubId: user.githubId, email: user.email, username: user.username });
  } catch (error) {
    console.error("❌ Error fetching GitHub user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Set Username Route
router.post("/set-username", async (req, res) => {
    const { githubId, username } = req.body;
  
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
  
    try {
      // ✅ Check across all collections
      const usernameRegex = new RegExp(`^${username}$`, "i");

      const [githubExists, googleExists, discordExists, emailExists] = await Promise.all([
        GitHubUser.findOne({ username: usernameRegex }),
        GoogleUser.findOne({ username: usernameRegex }),
        DiscordUser.findOne({ username: usernameRegex }),
        EmailUser.findOne({ username: usernameRegex }),
      ]);
  
      if (githubExists || googleExists || discordExists || emailExists) {
        return res.status(400).json({ message: "Username already taken" });
      }  
  
      // Find the GitHub user by their ID
      const user = await GitHubUser.findOne({ githubId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Set the username and save
      user.username = username;
      await user.save();
  
      res.json({ message: "Username set successfully", user });
    } catch (error) {
      console.error("❌ Error setting username:", error);
      res.status(500).json({ message: "Server error" });
    }
  });  

// ✅ Fetch GitHub Profile Data (Fix 404 issue)
router.get("/profile", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  
    try {
      const user = await GitHubUser.findOne({ githubId: req.user.githubId }); // Fixed githubId
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({
        githubId: user.githubId, // Consistent with DB field
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      });
    } catch (error) {
      console.error("❌ Error fetching GitHub profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  });  

export default router;