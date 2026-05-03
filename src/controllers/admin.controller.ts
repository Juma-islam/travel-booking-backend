import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import User from '../models/user.model.ts';
import Booking from '../models/booking.model.ts';
import Package from '../models/package.model.ts';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const totalUsers = await User.countDocuments({});
  const totalPackages = await Package.countDocuments({});
  const totalBookings = await Booking.countDocuments({});

  const paidBookings = await Booking.find({ isPaid: true });
  const totalRevenue = paidBookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

  const recentBookings = await Booking.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .populate('packageItem', 'title');

  // Monthly revenue for chart (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Booking.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Booking status breakdown
  const statusBreakdown = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    totalUsers,
    totalPackages,
    totalBookings,
    totalRevenue,
    recentBookings,
    monthlyRevenue,
    statusBreakdown,
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete admin user');
  }
  await user.deleteOne();
  res.json({ message: 'User removed' });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.role = req.body.role || user.role;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role });
});
