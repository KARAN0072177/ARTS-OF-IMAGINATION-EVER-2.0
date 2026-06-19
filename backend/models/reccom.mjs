import mongoose from "mongoose";

const ReccomSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  preferenceCategories: { type: [String], default: [] },
  generatedAt: Date,
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

ReccomSchema.index({ userId: 1 }, { unique: true });
ReccomSchema.index({ updatedAt: -1 });

const Reccom = mongoose.model("Reccom", ReccomSchema, "reccom"); // Explicit collection name

export default Reccom;
