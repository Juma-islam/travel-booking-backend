import express from 'express';
import {
  getRecommendations,
  generateItinerary,
  estimateBudget,
  summarizeReviews,
  chatWithAssistant,
} from '../controllers/ai.controller';

const router = express.Router();

router.post('/recommendations', getRecommendations);
router.post('/itinerary', generateItinerary);
router.post('/budget', estimateBudget);
router.post('/review-summary', summarizeReviews);
router.post('/chatbot', chatWithAssistant);

export default router;
