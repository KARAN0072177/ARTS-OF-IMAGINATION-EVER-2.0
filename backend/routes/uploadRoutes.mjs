import express from "express";
import Upload from "../models/Upload.mjs";

const router = express.Router();

/**
 * @route   POST /api/upload
 * @desc    Upload image details (with URL instead of file)
 * @access  Private (Admins Only)
 */
router.post("/", async (req, res) => {
  try {
    let { title, description, author, category, imageUrl } = req.body;

    console.log("Received Data for Upload:", req.body); // ✅ Debugging: Log received request body

    if (!title || !description || !author || !category || !imageUrl) {
      console.warn("Missing fields in request:", req.body); // ✅ Debugging: Log missing fields
      return res.status(400).json({ message: "All fields are required." });
    }

    // Convert category to an array (if not already)
    category = Array.isArray(category) ? category : category.split(",").map(cat => cat.trim());

    const newUpload = new Upload({ title, description, author, category, imageUrl });

    const savedUpload = await newUpload.save();
    console.log("Saved Upload to DB:", savedUpload); // ✅ Debugging: Log saved document

    res.status(201).json({ message: "Image uploaded successfully!" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/uploads
 * @desc    Fetch uploaded images with pagination
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = 50; // Show 50 images at a time
    const skip = (page - 1) * limit;

    console.log(`Fetching images: Page ${page}, Limit ${limit}, Skip ${skip}`); // ✅ Debugging: Pagination info

    // Fetch images from MongoDB (newest first)
    const images = await Upload.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log("Fetched Images from DB:", images.length > 0 ? images : "No images found"); // ✅ Debugging: Log fetched images

    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ API to fetch unique categories and their image counts
router.get("/categories", async (req, res) => {
  try {
    console.log("Fetching categories..."); // ✅ Debugging: Log category fetch start

    const images = await Upload.find({}, "category"); // Fetch only category field

    console.log("Fetched categories from DB:", images.length > 0 ? images : "No categories found"); // ✅ Debugging: Log fetched categories

    // 🔥 Step 1: Extract all categories from images
    let categoryCount = {};
    images.forEach((img) => {
      img.category.forEach((cat) => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    });

    // 🔥 Step 2: Add "All" category (sum of all images)
    categoryCount["All"] = images.length;

    console.log("Final category count:", categoryCount); // ✅ Debugging: Log category count

    res.json({ categories: categoryCount });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;