import mongoose from "mongoose";

const ClickSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  clicks: [
    {
      imageId: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  shares: [
    {
      imageId: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  downloads: { 
    type: [{ imageId: String, timestamp: Date }], 
    default: []  // ✅ Ensure empty array on creation
  },
  likes: { 
    type: [{ imageId: String, timestamp: Date }], 
    default: []  // ✅ Ensure empty array on creation
  },
});
export default mongoose.model("Clickvms502", ClickSchema);
