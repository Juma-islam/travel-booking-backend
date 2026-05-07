import express from 'express';
import { uploadImage, uploadMultipleImages, deleteImage } from '../controllers/upload.controller';
import { uploadPackageImage, uploadDestinationImage, uploadAvatar } from '../config/cloudinary';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

// Single image upload (package)
router.post('/package', protect, admin, uploadPackageImage.single('image'), uploadImage);

// Multiple images upload (package gallery)
router.post('/package/multiple', protect, admin, uploadPackageImage.array('images', 5), uploadMultipleImages);

// Destination image
router.post('/destination', protect, admin, uploadDestinationImage.single('image'), uploadImage);

// Avatar upload (any logged in user)
router.post('/avatar', protect, uploadAvatar.single('image'), uploadImage);

// Delete image
router.delete('/:publicId', protect, admin, deleteImage);

export default router;
