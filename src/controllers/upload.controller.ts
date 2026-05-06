import { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary.ts';

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private/Admin
export const uploadImage = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const file = req.file as any;

  res.json({
    url: file.path,
    publicId: file.filename,
    width: file.width,
    height: file.height,
  });
};

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private/Admin
export const uploadMultipleImages = (req: Request, res: Response) => {
  if (!req.files || (req.files as any[]).length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const files = req.files as any[];
  const urls = files.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));

  res.json({ images: urls });
};

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.params;
    const decodedId = decodeURIComponent(publicId);

    await cloudinary.uploader.destroy(decodedId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete image' });
  }
};
