import express from "express";
import AdminLogin from "../models/AdminLoginSchema.mjs";

const router = express.Router();

export default (io) => {
    // ✅ Fetch Admin Login History
    router.get("/admin-history", async (req, res) => {
        try {
            const history = await AdminLogin.find().sort({ timestamp: -1 }); // Latest first
            res.json(history);
        } catch (error) {
            console.error("Error fetching admin history:", error);
            res.status(500).json({ error: "Server error" });
        }
    });

    // ✅ Record Admin Login
    router.post("/admin-login", async (req, res) => {
        try {
            const { adminName, ipAddress } = req.body;

            if (!adminName || !ipAddress) {
                return res.status(400).json({ error: "Admin name and IP address are required" });
            }

            const newLogin = new AdminLogin({
                adminName,
                ipAddress,
                timestamp: new Date(),
                status: "Success",
            });

            await newLogin.save();

            // 🔥 Emit WebSocket event when an admin logs in
            io.emit("adminHistoryUpdate", { action: "login", data: newLogin });

            res.status(201).json({ message: "Admin login recorded successfully", data: newLogin });
        } catch (error) {
            console.error("Error recording admin login:", error);
            res.status(500).json({ error: "Server error" });
        }
    });

    // ✅ Track Admin Logout Time
    router.post("/admin-logout", async (req, res) => {
        const { adminName } = req.body;
    
        if (!adminName) {
            return res.status(400).json({ error: "Admin name is required" });
        }
    
        try {
            const adminRecord = await AdminLogin.findOne({ adminName }).sort({ timestamp: -1 });
    
            if (!adminRecord || adminRecord.logoutTime) {
                return res.status(404).json({ error: "No active session found" });
            }
    
            adminRecord.logoutTime = new Date();
            await adminRecord.save();
    
            // ✅ Emit logout event with logout time
            io.emit("adminLogout", { adminName, logoutTime: adminRecord.logoutTime });
    
            res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            console.error("Logout Error:", error);
            res.status(500).json({ error: "Server error" });
        }
    });    

    return router;
};