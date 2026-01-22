import mongoose from "mongoose";

const paymentHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed, // ObjectId or string depending on auth method
    required: true
  },
  authMethod: {
    type: String,
    enum: ['email','manual', 'google', 'github', 'discord'], // ✅ replaced 'manual' with 'email'
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'usd'
  },
  stripeSessionId: {
    type: String,
    required: true
  },
  receipt_url: {
    type: String // Optional but useful if you later pull Stripe receipt
  },
  product: {
    type: String,
    default: 'Premium Access'   // ✅ <-- ADD THIS
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Explicit collection name for clarity
export default mongoose.model("PaymentHistory", paymentHistorySchema, "payment_history");