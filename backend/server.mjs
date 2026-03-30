import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import xssClean from "xss-clean";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import paymentRoutes from './routes/paymentRoutes.mjs';
import stripeWebhook from './routes/stripeWebhook.mjs';

// Import Routes
import authRoutes from "./routes/authRoutes.mjs";
import newsletterRoutes from "./routes/newsletterRoutes.mjs";
import googleAuthRoutes from "./routes/googleAuthRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import likesRoutes from "./routes/likesRoutes.mjs";
import forgotPasswordRoutes from "./routes/forgotPasswordRoutes.mjs";
import githubAuthRoutes from "./routes/githubAuthRoutes.mjs";
import contactRoutes from "./routes/contactRoutes.mjs";
import imageRoutes from "./routes/imageRoutes.mjs";
import uploadRoutes from "./routes/uploadRoutes.mjs";
import logoutRoutes from "./routes/Logout.mjs";
import authDiscordRoutes from "./routes/authDiscord.mjs";
import clickRoutes from "./routes/clickroute.mjs"; // Or reccom.mjs based on where you added it
import reccomRoutes from "./routes/reccom.mjs";
import adminRoutes from "./routes/adminRoutes.mjs";
import adminHistoryRoutes from "./routes/admin_history.mjs";
import adminDataRoutes from "./routes/Data.mjs";
import premiumUploadsRoute from "./routes/premiumUploads.mjs";
import shareRoutes from "./routes/share.mjs";
import stripeRoutes from './routes/stripeRoutes.mjs';
import profileRoutes from "./routes/profileRoutes.mjs";
import likedImagesRoutes from "./routes/likedImagesRoutes.mjs";

dotenv.config();


const app = express();

// ✅ Create logs directory if not exists
// if (!fs.existsSync("logs")) {
//   fs.mkdirSync("logs");
// }

// // ✅ Create a write stream for request logs
// const accessLogStream = fs.createWriteStream(path.join("logs", "access.log"), { flags: "a" });

if (process.env.NODE_ENV !== "production") {
  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
  }

  const accessLogStream = fs.createWriteStream(
    path.join("logs", "access.log"),
    { flags: "a" }
  );

  app.use(morgan("dev", { stream: accessLogStream }));
} else {
  app.use(morgan("dev")); // console logs only
}

// // ✅ Log all requests (use 'dev' for concise logs, 'combined' for detailed logs)
// app.use(morgan("dev", { stream: accessLogStream }));


// ✅ CORS Config
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:4173", "http://localhost:5176", process.env.FRONTEND_URL], // ✅ Correct array format
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// 🔥 Store temporarily blocked IPs
const blockedIPs = new Map();

// ✅ Middleware to Check Blocked IPs
app.use((req, res, next) => {
  const clientIP = req.ip;
  const unblockTime = blockedIPs.get(clientIP);

  if (unblockTime && Date.now() > unblockTime) {
    blockedIPs.delete(clientIP);
  }

  if (blockedIPs.has(clientIP)) {
    return res.status(403).json({ message: "❌ Access denied. Too many failed login attempts. Try again later." });
  }

  next();
});

// ✅ Security: Set HTTP headers

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: [
//           "'self'",
//           "http://localhost:5173",
//           "https://www.google.com",
//           "https://www.gstatic.com",
//           "https://js.stripe.com",  // ✅ allow Stripe scripts
//           "'unsafe-inline'"
//         ],
//         styleSrc: [
//           "'self'",
//           "http://localhost:5173",
//           "https://fonts.googleapis.com",
//           "'unsafe-inline'"
//         ],
//         imgSrc: [
//           "'self'",
//           "data:",
//           "https://i.postimg.cc/",
//           "https://i.ibb.co/",
//           "https://img1.wallspic.com"
//         ],
//         connectSrc: [
//           "'self'",
//           "http://localhost:5173",
//           "http://localhost:5174",
//           "http://localhost:5176",
//           "http://localhost:5000",
//           "ws://localhost:5000",
//           "wss://localhost:5000",
//           "https://www.google.com",
//           "https://www.gstatic.com",
//           "https://i.postimg.cc",
//           "https://api.stripe.com", 
//         ],
//         fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
//         scriptSrcElem: [
//           "'self'",
//           "http://localhost:5173/node_modules",
//           "https://www.google.com",
//           "https://www.gstatic.com"
//         ],
//         frameSrc: ["'self'", "https://www.google.com","https://hooks.stripe.com","https://js.stripe.com"], // ✅ Allows Google reCAPTCHA iframes
//         frameAncestors: ["'none'"], // ✅ Protects against clickjacking
//       },
//     },
//     frameguard: { action: "deny" }, // ✅ Extra protection against clickjacking
//   })
// );


// ✅ Prevent HTTP Parameter Pollution
app.use(hpp());

// This should be ABOVE express.json() middleware to allow raw body parsing
app.use('/api/stripe/webhook', stripeWebhook);

// ✅ Prevent Body Size Exploits
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Prevent NoSQL Injection Attacks
app.use(mongoSanitize());

// ✅ Prevent XSS (Cross-Site Scripting) Attacks
app.use(xssClean());
app.use("/api/clicks", clickRoutes);


// Apply Rate Limiting (Limit each IP to 100 requests per 15 minutes)
// Login Rate Limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "❌ Too many failed login attempts. Try again in 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const clientIP = req.ip;
    const blockDuration = 15 * 60 * 1000;
    blockedIPs.set(clientIP, Date.now() + blockDuration);
    res.status(429).json({ message: "❌ Too many failed login attempts. Try again later." });

    // ✅ Only log locally (NOT in production)
    if (process.env.NODE_ENV !== "production") {
      fs.appendFileSync(
        "logs/suspicious.log",
        `🚨 BLOCKED: ${clientIP} - ${new Date().toISOString()}\n`
      );
    } else {
      console.warn(`🚨 BLOCKED: ${clientIP}`);
    }
  },
});

app.use("/api/auth/login", loginLimiter);


// Secure Session Handling
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none", // Allows cross-site cookies for production (adjust if needed)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ✅ Log Only Failed Logins
app.post("/api/auth/login", (req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode === 401 || res.statusCode === 403) {

      if (process.env.NODE_ENV !== "production") {
        fs.appendFileSync(
          "logs/suspicious.log",
          `⚠️ FAILED LOGIN: ${req.ip} - ${new Date().toISOString()}\n`
        );
      } else {
        console.warn(`⚠️ FAILED LOGIN: ${req.ip}`);
      }

    }
  });
  next();
});


// ✅ Mount Routes
app.use("/api/uploads", uploadRoutes);
// app.use("/api/uploadstest", uploadRoutes);
app.use("/api/images", imageRoutes);
app.use("/api", authRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/", googleAuthRoutes);
app.use("/api/user", userRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/password", forgotPasswordRoutes);
app.use("/api/github", githubAuthRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", logoutRoutes);
app.use("/auth", authDiscordRoutes);
app.use("/api/admin_data", adminDataRoutes);
app.use("/api/premium", premiumUploadsRoute);
app.use("/api/share", shareRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/liked-images", likedImagesRoutes); // 👈 New mount path

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the ARTS OF IMAGINATION Backend! API is running smoothly 🚀");
});

app.use("/api/gallery", reccomRoutes);
app.use(express.json()); // ✅ This ensures req.body is parsed correctly
app.use(express.urlencoded({ extended: true })); // ✅ Handles form data properly

app.post("/api/test-sanitize", (req, res) => {
  res.json({ message: "Sanitization test route is working!" });
});

const PORT = process.env.PORT || 5000;

// ✅ Create an HTTP server using Express app
const server = createServer(app);

// ✅ Create a WebSocket server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5176", process.env.FRONTEND_URL],
    credentials: true,
  },
});

// ✅ WebSocket Connection Handling
io.on("connection", (socket) => {
  console.log("⚡ A user connected:", socket.id);

  // ✅ Disconnect Event
  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

app.use("/api/admin", adminRoutes(io)); // Pass the WebSocket instance
app.use("/api/admins", adminHistoryRoutes(io)); // Pass the WebSocket instance

// ✅ Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});