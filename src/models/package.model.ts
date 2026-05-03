import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const packageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Destination',
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true },
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: ['solo', 'family', 'couple', 'adventure', 'relaxation'],
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: [reviewSchema],
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model('Package', packageSchema);
export default Package;
