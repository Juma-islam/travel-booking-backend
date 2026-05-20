import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

console.log("Cloudinary Config - Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for package images
const packageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travelai/packages',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }],
  } as any,
});

// Storage for destination images
const destinationStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travelai/destinations',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }],
  } as any,
});

// Storage for avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'travelai/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 200, height: 200, crop: 'fill', quality: 'auto' }],
  } as any,
});

export const uploadPackageImage = multer({
  storage: packageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadDestinationImage = multer({
  storage: destinationStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export { cloudinary };
