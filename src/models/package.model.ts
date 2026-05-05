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
    // Availability
    maxGuests: { type: Number, default: 20 },
    bookedSlots: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    // Host / Tour operator
    host: {
      name: { type: String, default: 'TravelAI Tours' },
      avatar: { type: String, default: '' },
      bio: { type: String, default: '' },
      responseRate: { type: Number, default: 98 },
      totalTours: { type: Number, default: 0 },
      joinedYear: { type: Number, default: 2021 },
    },
    // Cancellation policy
    cancellationPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      default: 'moderate',
    },
    // Location coordinates for map
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    // FAQ
    faqs: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model('Package', packageSchema);
export default Package;
