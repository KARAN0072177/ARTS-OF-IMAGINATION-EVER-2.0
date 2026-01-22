import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    imageId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Like", LikeSchema, "likes"); // 👈 Force collection name
