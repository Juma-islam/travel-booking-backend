import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
} from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-reset-token', verifyResetToken);

// Wishlist
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:packageId', protect, addToWishlist);
router.delete('/wishlist/:packageId', protect, removeFromWishlist);
router.put('/wishlist/:packageId', protect, toggleWishlist);

export default router;
