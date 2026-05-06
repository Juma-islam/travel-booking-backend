import express from 'express';
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/package.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(getPackages).post(protect, admin, createPackage);
router
  .route('/:id')
  .get(getPackageById)
  .put(protect, admin, updatePackage)
  .delete(protect, admin, deletePackage);

export default router;
