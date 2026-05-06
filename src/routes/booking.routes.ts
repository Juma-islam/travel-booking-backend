import express from 'express';
import {
  addBooking,
  getBookingById,
  updateBookingToPaid,
  updateBookingStatus,
  getMyBookings,
  getBookings,
} from '../controllers/booking.controller.ts';
import { createCheckoutSession } from '../controllers/webhook.controller.ts';
import { protect, admin } from '../middlewares/auth.middleware.ts';

const router = express.Router();

router.route('/').post(protect, addBooking).get(protect, admin, getBookings);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id').get(protect, getBookingById);
router.route('/:id/pay').put(protect, updateBookingToPaid);
router.route('/:id/status').put(protect, updateBookingStatus);
router.route('/:id/checkout').post(protect, createCheckoutSession);

export default router;
