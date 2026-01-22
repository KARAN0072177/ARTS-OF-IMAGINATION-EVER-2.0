import mongoose from "mongoose";

const googleLoginSchema = new mongoose.Schema({
  googleId: { type: String, required: true }, 
  email: { type: String, required: true }, 
  username: { type: String }, // ✅ Made optional to prevent validation errors
  loginTime: { type: Date, default: Date.now }, 
  ipAddress: { type: String }, 
  userAgent: { type: String },
  premium: { type: Boolean, default: false },
});

const GoogleLogin = mongoose.model("GoogleLogin", googleLoginSchema);


export default GoogleLogin;