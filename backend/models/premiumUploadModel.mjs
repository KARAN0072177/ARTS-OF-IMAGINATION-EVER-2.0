import mongoose from "mongoose";

const premiumUploadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  category: {
    type: [String],
    default: [],
  },
  resolution2k: {
    type: String,
    default: null,
  },
  resolution4k: {
    type: String,
    default: null,
  },
  resolution8k: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const PremiumUpload = mongoose.model("PremiumUpload", premiumUploadSchema);

export default PremiumUpload;