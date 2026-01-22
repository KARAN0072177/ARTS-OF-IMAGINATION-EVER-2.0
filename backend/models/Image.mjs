import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  title: String,
  description: String,
  author: String,
  category: String,
  uploadedImage: String, // Base64 or Image URL
});

export default mongoose.model("Image", ImageSchema);