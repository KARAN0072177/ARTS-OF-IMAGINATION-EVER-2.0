import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import AdminLogin from "../models/AdminLoginSchema.mjs";
import useragent from "useragent";

dotenv.config();
const router = express.Router();

export default (io) => {
    const allowedAdmins = ["karan", "ashok", "smit", "ankit"];
    const adminPassword = "admin123"; // Same for all admins

    router.post("/admin-login", async (req, res) => {
        const { username, password, captchaToken } = req.body;

        if (!captchaToken) {
            return res.status(400).json({ error: "reCAPTCHA verification failed" });
        }

        try {
            // ✅ Verify reCAPTCHA
            const response = await axios.post(
                "https://www.google.com/recaptcha/api/siteverify",
                null,
                {
                    params: {
                        secret: process.env.SECRET_KEY,
                        response: captchaToken,
                    },
                }
            );

            if (!response.data.success) {
                return res.status(400).json({ error: "reCAPTCHA verification failed" });
            }

            // ✅ Extract IP and user-agent details
            const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
            const agent = useragent.parse(req.headers["user-agent"]);
            const browser = agent.family || "Unknown Browser";
            const os = agent.os.toString() || "Unknown OS";
            const userAgent = req.headers["user-agent"] || "Unknown";

            // ✅ Handle failed login attempts
            if (!allowedAdmins.includes(username) || password !== adminPassword) {
                await logAdminAttempt(username, ip, browser, os, userAgent, "Failed");

                // 🔥 Emit WebSocket event for failed login attempt
                io.emit("adminFailedLogin", { adminName: username, status: "Failed", timestamp: new Date() });

                return res.status(401).json({ error: "Invalid credentials" });
            }

            // ✅ Handle successful login attempt
            const successLog = await logAdminAttempt(username, ip, browser, os, userAgent, "Success");

            // 🔥 Emit WebSocket event for successful login
            io.emit("adminHistoryUpdate", { action: "login", data: successLog });

            // ✅ Send adminName in response so frontend can store it in localStorage
            res.json({ success: true, message: "Admin logged in!", adminName: username });
        } catch (error) {
            console.error("Error verifying reCAPTCHA:", error);
            res.status(500).json({ error: "Server error" });
        }
    });

    // ✅ Function to log admin login attempts in MongoDB
    const logAdminAttempt = async (adminName, ipAddress, browser, operatingSystem, userAgent, status) => {
        try {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

            // Find the latest failed attempt by the same admin from the same IP
            const existingLog = await AdminLogin.findOne({
                adminName,
                ipAddress,
                status: "Failed",
                timestamp: { $gte: tenMinutesAgo },
            });

            if (status === "Failed") {
                if (existingLog) {
                    // ✅ Increment attempt count within the same session
                    return await AdminLogin.findByIdAndUpdate(
                        existingLog._id,
                        { $inc: { totalAttempts: 1 }, timestamp: new Date() },
                        { new: true }
                    );
                } else {
                    // ✅ Create a new failed attempt record if no recent one exists
                    return await AdminLogin.create({
                        adminName,
                        ipAddress,
                        operatingSystem,
                        browser,
                        userAgent,
                        status,
                        totalAttempts: 1,
                        timestamp: new Date(),
                    });
                }
            } else {
                // ✅ Always create a new record for successful logins
                return await AdminLogin.create({
                    adminName,
                    ipAddress,
                    operatingSystem,
                    browser,
                    userAgent,
                    status,
                    totalAttempts: 1,
                    timestamp: new Date(),
                });
            }
        } catch (error) {
            console.error("Error logging admin attempt:", error);
            return null;
        }
    };

    return router;
};