import express from 'express';
import { submitContact, getContacts } from '../controllers/contact.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/')
  .post(submitContact)
  .get(protect, admin, getContacts);

export default router;
