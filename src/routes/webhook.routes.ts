import express from 'express';
import { handleStripeWebhook } from '../controllers/webhook.controller';

const router = express.Router();

// Raw body needed for Stripe signature verification
router.post('/', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
