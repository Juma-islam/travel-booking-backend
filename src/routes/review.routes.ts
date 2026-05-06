import express from 'express';
import {
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  updateReviewStatus,
} from '../controllers/review.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(protect, admin, getAllReviews).post(protect, createReview);
router.route('/mine').get(protect, getMyReviews);
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);
router.route('/:id/status').put(protect, admin, updateReviewStatus);

export default router;
