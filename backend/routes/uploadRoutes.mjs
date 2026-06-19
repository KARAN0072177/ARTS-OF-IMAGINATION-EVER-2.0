import express from "express";
import Upload from "../models/Upload.mjs";
import {
  addThumbnailUrl,
  ensureThumbnail,
  getThumbnailUrl,
} from "../services/thumbnailService.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let { title, description, author, category, imageUrl } = req.body;

    if (!title || !description || !author || !category || !imageUrl) {
      return res.status(400).json({ message: "All fields are required." });
    }

    category = Array.isArray(category)
      ? category
      : category.split(",").map((cat) => cat.trim()).filter(Boolean);

    const savedUpload = await Upload.create({
      title,
      description,
      author,
      category,
      imageUrl,
    });

    savedUpload.thumbnailUrl = getThumbnailUrl(savedUpload._id);
    await savedUpload.save();

    return res.status(201).json({
      message: "Image uploaded successfully!",
      image: addThumbnailUrl(savedUpload),
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const skip = (page - 1) * limit;

    const images = await Upload.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json(images.map(addThumbnailUrl));
  } catch (error) {
    console.error("Error fetching images:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const images = await Upload.find({}, "category").lean();
    const categoryCount = {};

    images.forEach((img) => {
      (img.category || []).forEach((cat) => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    });

    categoryCount.All = images.length;

    return res.json({ categories: categoryCount });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/:id/thumbnail", async (req, res) => {
  let upload;

  try {
    upload = await Upload.findById(req.params.id).select("imageUrl").lean();

    if (!upload) {
      return res.status(404).json({ message: "Image not found" });
    }

    const thumbnailPath = await ensureThumbnail({
      uploadId: req.params.id,
      imageUrl: upload.imageUrl,
    });

    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.sendFile(thumbnailPath);
  } catch (error) {
    console.error("Error generating thumbnail:", error);

    if (upload?.imageUrl) {
      return res.redirect(302, upload.imageUrl);
    }

    return res.status(502).json({ message: "Could not generate thumbnail" });
  }
});

export default router;
