import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Package from '../models/package.model';

// @desc    Fetch all packages with filtering and search
// @route   GET /api/packages
// @access  Public
export const getPackages = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.pageNumber) || 1;

  // Keyword search
  const keyword = req.query.keyword
    ? {
      title: {
        $regex: req.query.keyword as string,
        $options: 'i',
      },
    }
    : {};

  // Filter by Category
  const categoryFilter = req.query.category ? { category: req.query.category } : {};

  // Filter by Destination
  const destinationFilter = req.query.destination ? { destination: req.query.destination } : {};

  // Filter by Max Price
  const priceFilter = req.query.maxPrice ? { price: { $lte: Number(req.query.maxPrice) } } : {};

  let sortOption: any = {};
  if (req.query.sort === 'rating') {
    sortOption = { rating: -1, numReviews: -1 };
  } else {
    sortOption = { createdAt: -1 };
  }

  const count = await Package.countDocuments({ ...keyword, ...categoryFilter, ...destinationFilter, ...priceFilter } as any);
  const packages = await Package.find({ ...keyword, ...categoryFilter, ...destinationFilter, ...priceFilter } as any)
    .populate('destination', 'name country')
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ packages, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Fetch single package
// @route   GET /api/packages/:id
// @access  Public
export const getPackageById = asyncHandler(async (req: Request, res: Response) => {
  const pkg = await Package.findById(req.params.id).populate('destination', 'name country description');

  if (pkg) {
    res.json(pkg);
  } else {
    res.status(404);
    throw new Error('Package not found');
  }
});

// @desc    Create a package
// @route   POST /api/packages
// @access  Private/Admin
export const createPackage = asyncHandler(async (req: Request, res: Response) => {
  const pkg = new Package({
    user: req.user._id,
    title: 'Sample Package',
    destination: req.body.destination, // Requires a valid destination ID
    description: 'Sample description',
    price: 0,
    duration: { days: 1, nights: 1 },
    images: ['/images/sample.jpg'],
    category: 'relaxation',
    inclusions: ['Flight'],
    exclusions: ['Food'],
    isPopular: false,
  });

  const createdPackage = await pkg.save();
  res.status(201).json(createdPackage);
});

// @desc    Update a package
// @route   PUT /api/packages/:id
// @access  Private/Admin
export const updatePackage = asyncHandler(async (req: Request, res: Response) => {
  const {
    title, destination, description, price, duration, images,
    category, inclusions, exclusions, isPopular,
    maxGuests, isAvailable, host, cancellationPolicy, coordinates, faqs,
  } = req.body;

  const pkg = await Package.findById(req.params.id);

  if (pkg) {
    pkg.title = title || pkg.title;
    pkg.destination = destination || pkg.destination;
    pkg.description = description || pkg.description;
    pkg.price = price || pkg.price;
    pkg.duration = duration || pkg.duration;
    pkg.images = images || pkg.images;
    pkg.category = category || pkg.category;
    pkg.inclusions = inclusions || pkg.inclusions;
    pkg.exclusions = exclusions || pkg.exclusions;
    if (isPopular !== undefined) (pkg as any).isPopular = isPopular;
    if (maxGuests !== undefined) (pkg as any).maxGuests = maxGuests;
    if (isAvailable !== undefined) (pkg as any).isAvailable = isAvailable;
    if (host) (pkg as any).host = { ...(pkg as any).host, ...host };
    if (cancellationPolicy) (pkg as any).cancellationPolicy = cancellationPolicy;
    if (coordinates) (pkg as any).coordinates = coordinates;
    if (faqs) (pkg as any).faqs = faqs;

    const updatedPackage = await pkg.save();
    res.json(updatedPackage);
  } else {
    res.status(404);
    throw new Error('Package not found');
  }
});

// @desc    Delete a package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
export const deletePackage = asyncHandler(async (req: Request, res: Response) => {
  const pkg = await Package.findById(req.params.id);

  if (pkg) {
    await pkg.deleteOne();
    res.json({ message: 'Package removed' });
  } else {
    res.status(404);
    throw new Error('Package not found');
  }
});
