import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Package',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'published', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// One review per user per package
reviewSchema.index({ user: 1, package: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
