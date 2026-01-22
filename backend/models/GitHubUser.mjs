import mongoose from "mongoose";

const GitHubUserSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    default: null,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows null values without unique constraint issues
  },
  avatar: {
    type: String, // Stores GitHub profile picture URL
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GitHubUser = mongoose.model("GitHubUser", GitHubUserSchema);
export default GitHubUser;