import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import User from '../models/user.model';
import Booking from '../models/booking.model';
import Package from '../models/package.model';

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

import Review from '../models/review.model.ts';
import AIUsage from '../models/aiUsage.model.ts';

// ─── Review Management ────────────────────────────────────────────────────────

// @desc    Get all reviews (admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAdminReviews = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string;
  const filter = status && status !== 'all' ? { status } : {};

  const reviews = await Review.find(filter)
    .populate('user', 'name email')
    .populate('package', 'title images')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

// @desc    Approve or reject a review
// @route   PUT /api/admin/reviews/:id
// @access  Private/Admin
export const updateAdminReview = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.status = status;
  const updated = await review.save();
  res.json(updated);
});

// @desc    Delete a review (admin)
// @route   DELETE /api/admin/reviews/:id
// @access  Private/Admin
export const deleteAdminReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  await review.deleteOne();
  res.json({ message: 'Review deleted' });
});

// ─── AI Usage Stats ───────────────────────────────────────────────────────────

// @desc    Get AI usage statistics
// @route   GET /api/admin/ai-stats
// @access  Private/Admin
export const getAIStats = asyncHandler(async (req: Request, res: Response) => {
  const totalCalls = await AIUsage.countDocuments({});
  const successCalls = await AIUsage.countDocuments({ success: true });
  const failedCalls = await AIUsage.countDocuments({ success: false });

  // By endpoint
  const byEndpoint = await AIUsage.aggregate([
    { $group: { _id: '$endpoint', count: { $sum: 1 }, avgTime: { $avg: '$responseTime' }, tokens: { $sum: '$tokensUsed' } } },
    { $sort: { count: -1 } },
  ]);

  // Last 7 days daily usage
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dailyUsage = await AIUsage.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const totalTokens = await AIUsage.aggregate([
    { $group: { _id: null, total: { $sum: '$tokensUsed' } } },
  ]);

  const avgResponseTime = await AIUsage.aggregate([
    { $match: { success: true } },
    { $group: { _id: null, avg: { $avg: '$responseTime' } } },
  ]);

  res.json({
    totalCalls,
    successCalls,
    failedCalls,
    successRate: totalCalls > 0 ? Math.round((successCalls / totalCalls) * 100) : 0,
    totalTokens: totalTokens[0]?.total || 0,
    avgResponseTime: Math.round(avgResponseTime[0]?.avg || 0),
    byEndpoint,
    dailyUsage,
  });
});

// ─── System Logs ──────────────────────────────────────────────────────────────

// @desc    Get system logs (recent activity)
// @route   GET /api/admin/logs
// @access  Private/Admin
export const getSystemLogs = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 50;

  // Combine recent bookings, users, reviews as activity log
  const [recentBookings, recentUsers, recentReviews, recentAI] = await Promise.all([
    Booking.find({}).sort({ createdAt: -1 }).limit(15).populate('user', 'name email').populate('packageItem', 'title'),
    User.find({}).sort({ createdAt: -1 }).limit(10).select('name email role createdAt'),
    Review.find({}).sort({ createdAt: -1 }).limit(10).populate('user', 'name').populate('package', 'title'),
    AIUsage.find({}).sort({ createdAt: -1 }).limit(15),
  ]);

  const logs = [
    ...recentBookings.map((b: any) => ({
      type: 'booking',
      message: `${b.user?.name || 'User'} booked "${b.packageItem?.title || 'Package'}"`,
      detail: `$${b.totalPrice} · ${b.status}`,
      time: b.createdAt,
      status: b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'error' : 'info',
    })),
    ...recentUsers.map((u: any) => ({
      type: 'user',
      message: `New user registered: ${u.name}`,
      detail: u.email,
      time: u.createdAt,
      status: 'success',
    })),
    ...recentReviews.map((r: any) => ({
      type: 'review',
      message: `Review submitted for "${r.package?.title || 'Package'}"`,
      detail: `by ${r.user?.name || 'User'} · ${r.status}`,
      time: r.createdAt,
      status: r.status === 'published' ? 'success' : r.status === 'rejected' ? 'error' : 'warning',
    })),
    ...recentAI.map((a: any) => ({
      type: 'ai',
      message: `AI ${a.endpoint} called`,
      detail: `${a.responseTime}ms · ${a.success ? 'success' : 'failed'}`,
      time: a.createdAt,
      status: a.success ? 'success' : 'error',
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit);

  res.json(logs);
});

// ─── Admin Settings ───────────────────────────────────────────────────────────

// @desc    Get admin settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getAdminSettings = asyncHandler(async (req: Request, res: Response) => {
  // Return current config (non-sensitive)
  res.json({
    siteName: 'TravelAI',
    siteEmail: process.env.SITE_EMAIL || 'hello@travelai.com',
    currency: 'USD',
    maxGuestsPerBooking: 20,
    promoCode: 'TRAVELAI20',
    promoDiscount: 20,
    maintenanceMode: false,
    aiModel: 'gemini-2.5-flash',
    stripeEnabled: !!process.env.STRIPE_SECRET_KEY,
    cloudinaryEnabled: !!process.env.CLOUDINARY_CLOUD_NAME,
    geminiEnabled: !!process.env.GEMINI_API_KEY,
  });
});
