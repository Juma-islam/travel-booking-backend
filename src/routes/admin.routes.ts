import express from 'express';
import {
  getDashboardStats,
  getUsers,
  deleteUser,
  updateUserRole,
  getAdminReviews,
  updateAdminReview,
  deleteAdminReview,
  getAIStats,
  getSystemLogs,
  getAdminSettings,
  broadcastNotification,
} from '../controllers/admin.controller.ts';
import { protect, admin } from '../middlewares/auth.middleware.ts';

const router = express.Router();

// Dashboard
router.route('/stats').get(protect, admin, getDashboardStats);

// Users
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);
router.route('/users/:id/role').put(protect, admin, updateUserRole);

// Reviews
router.route('/reviews').get(protect, admin, getAdminReviews);
router.route('/reviews/:id').put(protect, admin, updateAdminReview).delete(protect, admin, deleteAdminReview);

// AI Stats
router.route('/ai-stats').get(protect, admin, getAIStats);

// System Logs
router.route('/logs').get(protect, admin, getSystemLogs);

// Settings
router.route('/settings').get(protect, admin, getAdminSettings);

// Notifications
router.route('/notifications/broadcast').post(protect, admin, broadcastNotification);

export default router;
