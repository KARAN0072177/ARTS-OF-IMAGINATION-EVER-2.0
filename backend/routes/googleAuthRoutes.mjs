import express from "express";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GoogleUser from "../models/GoogleUser.mjs";
import GoogleLogin from "../models/GoogleLogin.mjs";
import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.mjs";
import GitHubUser from "../models/GitHubUser.mjs";
import DiscordUser from "../models/DiscordUser.mjs";
import EmailUser from "../models/EmailUser.mjs";

dotenv.config();

const router = express.Router();

// ✅ Google OAuth Passport Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await GoogleUser.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        } else {
          const newUser = new GoogleUser({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            picture: profile.photos[0].value,
            username: null, // ✅ Ensure username is null initially
          });

          await newUser.save();
          return done(null, newUser);
        }
      } catch (error) {
        console.error("❌ Error in Google OAuth:", error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

router.get("/test", (req, res) => {
  res.send("Google auth routes are working!");
});

// ✅ Google OAuth Routes
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("/");
    }

    const { googleId, email, username } = req.user;
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    if (!username) {
      // ✅ Redirect to Set Username Page FIRST if user has no username
      return res.redirect(`http://localhost:5173/set-username?googleId=${googleId}`);
    }

    // ✅ Check if a login entry already exists before creating a new one
    const existingLogin = await GoogleLogin.findOne({ googleId, ipAddress, userAgent });

    if (!existingLogin) {
      await GoogleLogin.create({
        googleId,
        email,
        username,
        ipAddress,
        userAgent,
      });
    }

    await sendEmail(
      email,
      "🔔 New Login Alert - Arts of Imagination Ever",
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9; border-radius: 8px;">
        
        <h2 style="color: #333; text-align: center;">🔔 New Login Detected</h2>
    
        <p style="color: #555; text-align: center;">Hi <strong>${username || "User"}</strong>,</p>
    
        <p style="color: #555; text-align: center;">We noticed a new login to your account:</p>
    
        <div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin: 20px 0;">
          <p style="margin: 8px 0;"><strong>📍 IP Address:</strong> ${ipAddress}</p>
          <p style="margin: 8px 0;"><strong>💻 Device:</strong> ${userAgent}</p>
          <p style="margin: 8px 0;"><strong>📅 Date & Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
    
        <p style="color: #555; text-align: center;">If this was <strong>you</strong>, no further action is needed.</p>
    
        <p style="color: red; font-weight: bold; text-align: center;">If this was NOT you, please secure your account immediately!</p>
    
        <div style="text-align: center; margin: 20px 0;">
          <a href="http://localhost:5173/profile" 
            style="color: white; background: red; padding: 12px 25px; text-decoration: none; display: inline-block; border-radius: 5px; font-weight: bold; font-size: 16px;">
            🔒 Secure Your Account
          </a>
        </div>
    
        <p style="text-align: center; color: #555;">
          Need help? <a href="http://localhost:5173/contact" style="color: #007bff; text-decoration: none; font-weight: bold;">Contact Us</a>
        </p>
    
        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
    
        <p style="text-align: center; font-size: 12px; color: #777;">
          © ${new Date().getFullYear()} Arts of Imagination Ever | All rights reserved.
        </p>
    
        <p style="text-align: center;">
          <a href="http://localhost:5173" style="color: #007bff; text-decoration: none; font-size: 14px; font-weight: bold;">Visit Our Website</a>
        </p>
      </div>
      `
    );     

    console.log("✅ Login email sent to:", email);

    // ✅ Redirect to `GoogleSuccess.jsx` instead of home page
    res.redirect("http://localhost:5173/google-success");

  } catch (error) {
    console.error("❌ Error in Google login tracking:", error);
    res.redirect("/");
  }
});

// ✅ New API Route to Fetch Google User Data
router.get("/api/auth/google/success", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { googleId, email, username } = req.user;

  res.json({ googleId, email, username });
});

// ✅ Set Username Route (After Google Login)
router.post("/set-username", async (req, res) => {
  const { googleId, username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  const usernameRegex = new RegExp(`^${username}$`, "i"); // case-insensitive exact match

  try {
    const [githubExists, googleExists, discordExists, emailExists] = await Promise.all([
      GitHubUser.findOne({ username: usernameRegex }),
      GoogleUser.findOne({ username: usernameRegex }),
      DiscordUser.findOne({ username: usernameRegex }),
      EmailUser.findOne({ username: usernameRegex }),
    ]);

    if (githubExists || googleExists || discordExists || emailExists) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const user = await GoogleUser.findOne({ googleId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username;
    await user.save();

    // ✅ Now that the user has a username, track their login
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    await GoogleLogin.create({
      googleId,
      email: user.email,
      username,
      ipAddress,
      userAgent,
    });

    res.json({ message: "Username set successfully" });

  } catch (error) {
    console.error("❌ Error setting username:", error);
    res.status(500).json({ message: "Error setting username" });
  }
});

export default router;