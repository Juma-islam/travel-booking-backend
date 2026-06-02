import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Booking from '../models/booking.model';
import Package from '../models/package.model';
import Notification from '../models/notification.model';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const addBooking = asyncHandler(async (req: Request, res: Response) => {
  const { packageId, startDate, endDate, guests, paymentMethod, promoCode } = req.body;

  if (!packageId) {
    res.status(400);
    throw new Error('No package selected');
  }

  const pkg = await Package.findById(packageId);

  if (!pkg) {
    res.status(404);
    throw new Error('Package not found');
  }

  let basePrice = pkg.price * guests;
  let discount = 0;

  if (promoCode === 'TRAVELAI20') {
    discount = basePrice * 0.20;
  }

  const totalPrice = basePrice - discount;

  const booking = new Booking({
    user: req.user._id,
    packageItem: packageId,
    startDate,
    endDate,
    guests,
    paymentMethod,
    discount,
    totalPrice,
  });

  const createdBooking = await booking.save();

  // Send booking notification
  await Notification.create({
    user: req.user._id,
    type: 'booking',
    title: 'Booking Created 🎉',
    message: `Your booking for "${pkg.title}" has been created. Total: $${totalPrice.toFixed(2)}`,
    link: '/user/bookings',
  });

  res.status(201).json(createdBooking);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email')
    .populate('packageItem', 'title destination images');

  if (booking && (booking.user._id.toString() === req.user._id.toString() || req.user.role === 'admin')) {
    res.json(booking);
  } else {
    res.status(404);
    throw new Error('Booking not found or not authorized');
  }
});

// @desc    Update booking status (e.g. Cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const booking = await Booking.findById(req.params.id);
  const { status } = req.body;

  if (booking && (booking.user._id.toString() === req.user._id.toString() || req.user.role === 'admin')) {
    // Basic validation
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404);
    throw new Error('Booking not found or not authorized');
  }
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('packageItem', 'title images');
  res.json(bookings);
});

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await Booking.find({}).populate('user', 'id name').populate('packageItem', 'title');
  res.json(bookings);
});
