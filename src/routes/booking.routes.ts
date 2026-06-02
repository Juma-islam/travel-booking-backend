import express from 'express';
import {
  addBooking,
  getBookingById,
  updateBookingStatus,
  getMyBookings,
  getBookings,
} from '../controllers/booking.controller';
import { createCheckoutSession } from '../controllers/webhook.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').post(protect, addBooking).get(protect, admin, getBookings);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id').get(protect, getBookingById);
router.route('/:id/status').put(protect, updateBookingStatus);
router.route('/:id/checkout').post(protect, createCheckoutSession);
router.route('/:id/create-checkout-session').post(protect, createCheckoutSession);

export default router;
