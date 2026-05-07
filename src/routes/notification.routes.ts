import express from 'express';
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '../controllers/notification.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(protect, getMyNotifications).delete(protect, deleteAllNotifications);
router.route('/unread-count').get(protect, getUnreadCount);
router.route('/read-all').put(protect, markAllAsRead);
router.route('/:id/read').put(protect, markAsRead);
router.route('/:id').delete(protect, deleteNotification);

export default router;
