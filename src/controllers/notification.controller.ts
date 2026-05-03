import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Notification from '../models/notification.model.ts';

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(notifications);
});

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const count = await Notification.countDocuments({ user: req.user._id, read: false });
  res.json({ count });
});

// @desc    Mark one as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const notif = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!notif) {
    res.status(404);
    throw new Error('Notification not found');
  }
  notif.read = true;
  await notif.save();
  res.json(notif);
});

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ message: 'All notifications marked as read' });
});

// @desc    Delete one notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Notification deleted' });
});

// @desc    Delete all notifications
// @route   DELETE /api/notifications
// @access  Private
export const deleteAllNotifications = asyncHandler(async (req: Request, res: Response) => {
  await Notification.deleteMany({ user: req.user._id });
  res.json({ message: 'All notifications cleared' });
});
