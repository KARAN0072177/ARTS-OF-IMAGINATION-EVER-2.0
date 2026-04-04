import os
import time
from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import threading
from collections import Counter
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ✅ Enable CORS (important for frontend calls)
CORS(app, supports_credentials=True)

# ✅ MongoDB setup
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in environment variables")

client = MongoClient(MONGO_URI)
db = client["test"]
user_interactions = db["clickvms502"]
uploads = db["uploads"]
reccom = db["reccom"]

# ✅ Test route (important for deployment check)
@app.route("/")
def home():
    return "Flask Recommendation Service Running 🚀"

# ✅ Recommendation Engine
def update_recommendations():
    print("[INFO] Background recommendation updater started...", flush=True)

    while True:
        users = user_interactions.distinct("userId")

        for user_id in users:
            print(f"[INFO] Processing recommendations for user: {user_id}", flush=True)

            user_data = user_interactions.find_one({"userId": user_id})

            if not user_data or "clicks" not in user_data:
                print(f"[WARNING] No interactions found for user: {user_id}", flush=True)
                continue

            clicked_image_ids = [ObjectId(click["imageId"]) for click in user_data["clicks"]]
            category_counts = Counter()

            # Step 1: Get categories of clicked images
            clicked_images = list(uploads.find({"_id": {"$in": clicked_image_ids}}))

            for image in clicked_images:
                for category in image.get("category", []):
                    category_counts[category] += 1

            if not category_counts:
                print(f"[WARNING] No categories found for user {user_id}", flush=True)
                continue

            # Step 2: Sort categories
            sorted_categories = [cat for cat, _ in category_counts.most_common()]
            print(f"[INFO] User {user_id} category preferences: {sorted_categories}", flush=True)

            # Step 3: Find similar images
            similar_images = list(uploads.find({"category": {"$in": sorted_categories}}))

            # Step 4: Rank images
            def rank_image(image):
                return sum(category_counts.get(cat, 0) for cat in image.get("category", []))

            sorted_images = sorted(similar_images, key=rank_image, reverse=True)

            # Step 5: Prepare response
            full_image_details = [
                {
                    "_id": str(image["_id"]),
                    "title": image.get("title", ""),
                    "description": image.get("description", ""),
                    "author": image.get("author", ""),
                    "category": image.get("category", []),
                    "imageUrl": image.get("imageUrl", ""),
                    "createdAt": image.get("createdAt", ""),
                }
                for image in sorted_images
            ]

            print(f"[DEBUG] Saving recommendations for user {user_id}", flush=True)

            # Step 6: Save to DB
            reccom.update_one(
                {"userId": user_id},
                {"$set": {"images": full_image_details}},
                upsert=True
            )

            print(f"[SUCCESS] Recommendations updated for user {user_id}", flush=True)

        print("[INFO] Sleeping for 1 minute...", flush=True)
        time.sleep(60)

# ✅ Safe background thread (IMPORTANT for Render + Gunicorn)
def start_background_thread():
    thread = threading.Thread(target=update_recommendations, daemon=True)
    thread.start()

# 🔥 Run background thread ONLY once
if os.environ.get("RUN_MAIN") or os.environ.get("WERKZEUG_RUN_MAIN"):
    start_background_thread()

# ✅ Production entry point
if __name__ == "__main__":
    print("[INFO] Flask server is running...", flush=True)
    app.run()