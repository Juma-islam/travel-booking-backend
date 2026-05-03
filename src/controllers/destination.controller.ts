import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Destination from '../models/destination.model.ts';

// @desc    Fetch all destinations
// @route   GET /api/destinations
// @access  Public
export const getDestinations = asyncHandler(async (req: Request, res: Response) => {
  const isTrending = req.query.isTrending ? { isTrending: true } : {};
  const destinations = await Destination.find({ ...isTrending });
  res.json(destinations);
});

// @desc    Fetch single destination
// @route   GET /api/destinations/:id
// @access  Public
export const getDestinationById = asyncHandler(async (req: Request, res: Response) => {
  const destination = await Destination.findById(req.params.id);

  if (destination) {
    res.json(destination);
  } else {
    res.status(404);
    throw new Error('Destination not found');
  }
});

// @desc    Create a destination
// @route   POST /api/destinations
// @access  Private/Admin
export const createDestination = asyncHandler(async (req: Request, res: Response) => {
  const { name, country, description, imageUrl, isTrending } = req.body;

  const destination = new Destination({
    name,
    country,
    description,
    imageUrl,
    isTrending,
  });

  const createdDestination = await destination.save();
  res.status(201).json(createdDestination);
});

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
export const updateDestination = asyncHandler(async (req: Request, res: Response) => {
  const { name, country, description, imageUrl, isTrending } = req.body;

  const destination = await Destination.findById(req.params.id);

  if (destination) {
    destination.name = name || destination.name;
    destination.country = country || destination.country;
    destination.description = description || destination.description;
    destination.imageUrl = imageUrl || destination.imageUrl;
    if (isTrending !== undefined) destination.isTrending = isTrending;

    const updatedDestination = await destination.save();
    res.json(updatedDestination);
  } else {
    res.status(404);
    throw new Error('Destination not found');
  }
});

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
export const deleteDestination = asyncHandler(async (req: Request, res: Response) => {
  const destination = await Destination.findById(req.params.id);

  if (destination) {
    await destination.deleteOne();
    res.json({ message: 'Destination removed' });
  } else {
    res.status(404);
    throw new Error('Destination not found');
  }
});
