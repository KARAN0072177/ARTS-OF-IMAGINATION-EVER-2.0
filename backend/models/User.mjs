import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Explicitly set the collection name to "email_users"
const User = mongoose.model("User", userSchema, "email_users");
export default User;