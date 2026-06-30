import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const THUMBNAIL_CACHE_DIR = path.resolve(process.cwd(), "cache", "thumbnails");
const DEFAULT_WIDTH = 520;
const DEFAULT_QUALITY = 74;
const DEFAULT_TIMEOUT_MS = 15000;

const getCachePath = (uploadId) => {
  const safeId = crypto.createHash("sha1").update(uploadId.toString()).digest("hex");
  return path.join(THUMBNAIL_CACHE_DIR, `${safeId}.webp`);
};

const fetchImageBuffer = async (imageUrl) => {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    Number(process.env.THUMBNAIL_FETCH_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS
  );

  try {
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "User-Agent": "Mozilla/5.0 AOIE-Thumbnail-Service/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Image fetch failed with status ${response.status}`);
    }

    return Buffer.from(await response.arrayBuffer());
  } finally {
    clearTimeout(timeout);
  }
};

export const getThumbnailUrl = (firstParam, secondParam) => {
  // If first parameter is an absolute URL, use the Cloudflare weserv proxy
  if (typeof firstParam === "string" && firstParam.startsWith("http")) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(firstParam)}&w=520&output=webp&q=75`;
  }
  // If second parameter is an absolute URL, use the Cloudflare weserv proxy
  if (typeof secondParam === "string" && secondParam.startsWith("http")) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(secondParam)}&w=520&output=webp&q=75`;
  }

  // Fallback to local endpoint path if no absolute URL is available
  const id = (firstParam && !firstParam.toString().startsWith("http") ? firstParam : secondParam) || "";
  return `/api/uploads/${id}/thumbnail`;
};

export const addThumbnailUrl = (upload) => {
  if (!upload) return upload;

  const plainUpload = upload.toObject ? upload.toObject() : upload;
  const id = plainUpload._id?.toString();
  const imageUrl = plainUpload.imageUrl;

  return {
    ...plainUpload,
    _id: id || plainUpload._id,
    thumbnailUrl: id ? getThumbnailUrl(imageUrl, id) : plainUpload.thumbnailUrl,
  };
};

export const ensureThumbnail = async ({ uploadId, imageUrl }) => {
  if (!uploadId || !imageUrl) {
    throw new Error("uploadId and imageUrl are required for thumbnail generation.");
  }

  await fs.mkdir(THUMBNAIL_CACHE_DIR, { recursive: true });

  const thumbnailPath = getCachePath(uploadId);

  try {
    await fs.access(thumbnailPath);
    return thumbnailPath;
  } catch {
    const sourceBuffer = await fetchImageBuffer(imageUrl);

    await sharp(sourceBuffer)
      .rotate()
      .resize({
        width: Number(process.env.THUMBNAIL_WIDTH) || DEFAULT_WIDTH,
        withoutEnlargement: true,
      })
      .webp({ quality: Number(process.env.THUMBNAIL_QUALITY) || DEFAULT_QUALITY })
      .toFile(thumbnailPath);

    return thumbnailPath;
  }
};
