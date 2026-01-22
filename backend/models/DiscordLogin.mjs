import mongoose from "mongoose";

const DiscordLoginSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "DiscordUser", required: true },
  loginTime: { type: Date, default: Date.now },
  premium: { type: Boolean, default: false },
});

export default mongoose.model("DiscordLogin", DiscordLoginSchema);