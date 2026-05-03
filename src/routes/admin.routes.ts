import express from 'express';
import { getDashboardStats, getUsers, deleteUser, updateUserRole } from '../controllers/admin.controller.ts';
import { protect, admin } from '../middlewares/auth.middleware.ts';

const router = express.Router();

router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);
router.route('/users/:id/role').put(protect, admin, updateUserRole);

export default router;
