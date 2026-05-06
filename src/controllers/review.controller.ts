import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Review from '../models/review.model';
import Package from '../models/package.model';
import Notification from '../models/notification.model';

// @desc    Get my reviews
// @route   GET /api/reviews/mine
// @access  Private
export const getMyReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate('package', 'title images destination')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { packageId, rating, comment } = req.body;

  if (!packageId || !rating || !comment) {
    res.status(400);
    throw new Error('packageId, rating, and comment are required');
  }

  const pkg = await Package.findById(packageId);
  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }

  // Check duplicate
  const existing = await Review.findOne({ user: req.user._id, package: packageId });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this package');
  }

  const review = await Review.create({
    user: req.user._id,
    package: packageId,
    rating,
    comment,
    status: 'pending',
  });

  // Notify admin
  await Notification.create({
    user: req.user._id,
    type: 'system',
    title: 'Review Submitted',
    message: `Your review for "${pkg.title}" has been submitted and is pending approval.`,
    link: `/user/reviews`,
  });

  const populated = await review.populate('package', 'title images destination');
  res.status(201).json(populated);
});

// @desc    Update my review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this review');
  }

  review.rating = req.body.rating ?? review.rating;
  review.comment = req.body.comment ?? review.comment;
  review.status = 'pending'; // re-review after edit

  const updated = await review.save();
  const populated = await updated.populate('package', 'title images destination');
  res.json(populated);
});

// @desc    Delete my review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  await review.deleteOne();
  res.json({ message: 'Review deleted' });
});

// @desc    Get all reviews (admin)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({})
    .populate('user', 'name email')
    .populate('package', 'title')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

// @desc    Update review status (admin)
// @route   PUT /api/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id).populate('user', '_id');

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.status = req.body.status ?? review.status;
  const updated = await review.save();

  // Notify user
  const userId = (review.user as any)._id || review.user;
  await Notification.create({
    user: userId,
    type: 'system',
    title: review.status === 'published' ? 'Review Published ✅' : 'Review Update',
    message: `Your review has been ${review.status}.`,
    link: '/user/reviews',
  });

  res.json(updated);
});
