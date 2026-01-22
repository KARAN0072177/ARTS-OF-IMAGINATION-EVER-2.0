import mongoose from "mongoose";

// ✅ Schema for storing login attempts
const EmailLoginSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  lastLogin: { type: Date, default: Date.now }, // ✅ Add this field
  ipAddress: { type: String },  // ✅ Store IP address
  premium: { type: Boolean, default: false },
  userAgent: { type: String }   // ✅ Store device info
});

// ✅ Create the model with explicit collection name
export default mongoose.model("EmailLogin", EmailLoginSchema, "emaillogin");