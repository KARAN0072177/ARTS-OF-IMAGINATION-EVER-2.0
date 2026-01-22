import mongoose from "mongoose";

const DiscordUserSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, required: false }, // ❌ Removed `required: true`
  email: { type: String }, // Some Discord accounts may not have emails
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("DiscordUser", DiscordUserSchema);