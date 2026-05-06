import mongoose from 'mongoose';

const aiUsageSchema = new mongoose.Schema(
  {
    endpoint: { type: String, required: true }, // recommendations, itinerary, budget, chatbot, review-summary
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    prompt: { type: String },
    tokensUsed: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 }, // ms
    success: { type: Boolean, default: true },
    error: { type: String },
  },
  { timestamps: true }
);

const AIUsage = mongoose.model('AIUsage', aiUsageSchema);
export default AIUsage;
