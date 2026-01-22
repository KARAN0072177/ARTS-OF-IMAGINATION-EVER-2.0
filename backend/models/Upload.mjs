import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: [String], required: true },
  imageUrl: { type: String, required: true }, // ✅ Store image URL instead of Buffer
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Upload", UploadSchema);