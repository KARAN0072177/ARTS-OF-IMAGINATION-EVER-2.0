import mongoose from "mongoose";

const sharedLinkSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  imageId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "PremiumUpload" },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Auto-expire after 1 hour
});

export default mongoose.model("SharedLink", sharedLinkSchema);