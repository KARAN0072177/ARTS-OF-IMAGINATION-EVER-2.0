import mongoose from "mongoose";

const GitHubLoginSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: false, // Will store user's IP address during login
  },
  userAgent: {
    type: String,
    required: false, // Will store user's device/browser details
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
  premium: { type: Boolean, default: false },
});

const GitHubLogin = mongoose.model("GitHubLogin", GitHubLoginSchema);
export default GitHubLogin;