import mongoose from "mongoose";

const googleUserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String },
  provider: { type: String, default: "google" },
  username: { type: String, default: null },
});

const GoogleUser =
  mongoose.models.GoogleUser || mongoose.model("GoogleUser", googleUserSchema);

export default GoogleUser;