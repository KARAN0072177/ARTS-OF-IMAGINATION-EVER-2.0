import mongoose from "mongoose";
import Click from "../models/click.mjs";
import Reccom from "../models/reccom.mjs";
import Upload from "../models/Upload.mjs";

const ACTION_WEIGHTS = {
  clicks: 1,
  shares: 2,
  downloads: 3,
  likes: 4,
};

const DEFAULT_RECOMMENDATION_LIMIT = 120;
const DEFAULT_REFRESH_INTERVAL_MS = 60 * 1000;
const DEFAULT_REFRESH_DEBOUNCE_MS = 10 * 1000;
const DEFAULT_REFRESH_BATCH_SIZE = 25;

let scheduler;
let schedulerRunning = false;
const pendingUserRefreshes = new Map();

const getRecommendationLimit = () =>
  Number(process.env.RECOMMENDATION_LIMIT) || DEFAULT_RECOMMENDATION_LIMIT;

const getRefreshIntervalMs = () =>
  Number(process.env.RECOMMENDATION_REFRESH_INTERVAL_MS) || DEFAULT_REFRESH_INTERVAL_MS;

const getRefreshDebounceMs = () =>
  Number(process.env.RECOMMENDATION_REFRESH_DEBOUNCE_MS) || DEFAULT_REFRESH_DEBOUNCE_MS;

const getRefreshBatchSize = () =>
  Number(process.env.RECOMMENDATION_REFRESH_BATCH_SIZE) || DEFAULT_REFRESH_BATCH_SIZE;

const toObjectId = (value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return null;
  }

  return new mongoose.Types.ObjectId(value);
};

const normalizeCategories = (categories) => {
  if (Array.isArray(categories)) {
    return categories.filter(Boolean);
  }

  return categories ? [categories] : [];
};

const serializeImage = (image) => ({
  _id: image._id.toString(),
  title: image.title || "",
  description: image.description || "",
  author: image.author || "",
  category: normalizeCategories(image.category),
  imageUrl: image.imageUrl || "",
  createdAt: image.createdAt,
});

const buildPreferenceScores = (interactionDoc) => {
  const scores = new Map();
  const interactedIds = new Set();

  for (const [action, weight] of Object.entries(ACTION_WEIGHTS)) {
    for (const entry of interactionDoc[action] || []) {
      if (!entry?.imageId) continue;

      const id = entry.imageId.toString();
      interactedIds.add(id);
      scores.set(id, (scores.get(id) || 0) + weight);
    }
  }

  return { interactedIds, scores };
};

const rankCategories = (images, imageScores) => {
  const categoryScores = new Map();

  for (const image of images) {
    const imageScore = imageScores.get(image._id.toString()) || 1;

    for (const category of normalizeCategories(image.category)) {
      categoryScores.set(category, (categoryScores.get(category) || 0) + imageScore);
    }
  }

  return [...categoryScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);
};

export const updateRecommendationsForUser = async (userId) => {
  if (!userId) {
    return null;
  }

  const interactionDoc = await Click.findOne({ userId: userId.toString() }).lean();

  if (!interactionDoc) {
    return null;
  }

  const { interactedIds, scores } = buildPreferenceScores(interactionDoc);
  const objectIds = [...interactedIds].map(toObjectId).filter(Boolean);

  if (!objectIds.length) {
    return null;
  }

  const interactedImages = await Upload.find({ _id: { $in: objectIds } })
    .select("title description author category imageUrl createdAt")
    .lean();

  const preferredCategories = rankCategories(interactedImages, scores);

  if (!preferredCategories.length) {
    return null;
  }

  const candidates = await Upload.find({ category: { $in: preferredCategories } })
    .select("title description author category imageUrl createdAt")
    .sort({ createdAt: -1 })
    .limit(getRecommendationLimit())
    .lean();

  const categoryRank = new Map(preferredCategories.map((category, index) => [category, index]));

  const rankedImages = candidates
    .map((image) => {
      const categories = normalizeCategories(image.category);
      const score = categories.reduce((total, category) => {
        const categoryWeight = preferredCategories.length - (categoryRank.get(category) ?? preferredCategories.length);
        return total + categoryWeight;
      }, 0);

      return { image, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.image.createdAt || 0) - new Date(a.image.createdAt || 0);
    })
    .map(({ image }) => serializeImage(image));

  await Reccom.findOneAndUpdate(
    { userId: userId.toString() },
    {
      $set: {
        images: rankedImages,
        preferenceCategories: preferredCategories,
        generatedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );

  return {
    images: rankedImages,
    preferenceCategories: preferredCategories,
  };
};

export const updateAllRecommendations = async () => {
  const userIds = await Click.distinct("userId");
  const batchSize = getRefreshBatchSize();

  for (let index = 0; index < userIds.length; index += batchSize) {
    const batch = userIds.slice(index, index + batchSize);
    await Promise.allSettled(
      batch.map((userId) => updateRecommendationsForUser(userId))
    );
  }

  return userIds.length;
};

const runScheduledRefresh = async () => {
  if (schedulerRunning) {
    return;
  }

  schedulerRunning = true;

  try {
    const userCount = await updateAllRecommendations();
    console.log(`Recommendations refreshed for ${userCount} users`);
  } catch (error) {
    console.error("Scheduled recommendation refresh failed:", error);
  } finally {
    schedulerRunning = false;
  }
};

export const getRecommendationsForUser = async (userId) => {
  const cached = await Reccom.findOne({ userId: userId.toString() }).lean();

  if (cached?.images?.length) {
    return { images: cached.images, source: "reccom" };
  }

  const generated = await updateRecommendationsForUser(userId);

  if (generated?.images?.length) {
    return { images: generated.images, source: "reccom-generated" };
  }

  return null;
};

export const scheduleUserRecommendationRefresh = (userId) => {
  if (!userId) return;

  const normalizedUserId = userId.toString();
  const existingTimer = pendingUserRefreshes.get(normalizedUserId);

  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(async () => {
    pendingUserRefreshes.delete(normalizedUserId);

    try {
      await updateRecommendationsForUser(normalizedUserId);
    } catch (error) {
      console.error("Recommendation refresh failed:", error);
    }
  }, getRefreshDebounceMs());

  pendingUserRefreshes.set(normalizedUserId, timer);
};

export const startRecommendationScheduler = () => {
  if (scheduler || process.env.RECOMMENDATION_ENGINE_ENABLED === "false") {
    return;
  }

  setTimeout(runScheduledRefresh, 0).unref?.();
  scheduler = setInterval(runScheduledRefresh, getRefreshIntervalMs());

  scheduler.unref?.();
};
