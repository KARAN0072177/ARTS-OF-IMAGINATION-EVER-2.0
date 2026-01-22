import mongoose from "mongoose";

const AdminLoginSchema = new mongoose.Schema({
  adminName: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }, // Login Time
  logoutTime: { type: Date, default: null }, // ✅ New Field: Logout Time
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  operatingSystem: { type: String, required: true }, // OS Information
  browser: { type: String, required: true }, // Browser Information
  status: { type: String, enum: ["Success", "Failed"], required: true },
  totalAttempts: { type: Number, default: 1 },
  logoutTime: { type: Date, default: null }, // ✅ New field for logout time
});

const AdminLogin = mongoose.model("AdminLogin", AdminLoginSchema);
export default AdminLogin;