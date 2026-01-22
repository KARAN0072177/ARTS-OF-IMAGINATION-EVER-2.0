import mongoose from "mongoose";

const ReccomSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  images: [
    {
      _id: { type: String, required: true }, // Store as a string
      title: String,
      description: String,
      author: String,
      category: [String],
      imageUrl: String,
      createdAt: Date
    }
  ]
}, { timestamps: true });

const Reccom = mongoose.model("Reccom", ReccomSchema, "reccom"); // Explicit collection name

export default Reccom;
