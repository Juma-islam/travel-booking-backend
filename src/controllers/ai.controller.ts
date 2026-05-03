import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { generateText } from '../services/gemini.service.ts';

// @desc    Get AI Travel Recommendations
// @route   POST /api/ai/recommendations
// @access  Public
export const getRecommendations = asyncHandler(async (req: Request, res: Response) => {
  const { budget, travelType, season, locationPreference } = req.body;

  if (!budget || !travelType || !season || !locationPreference) {
    res.status(400);
    throw new Error('Missing required fields: budget, travelType, season, locationPreference');
  }

  const prompt = `Act as an expert travel advisor. Suggest 3 top travel destinations based on the following criteria:
  - Budget: ${budget}
  - Travel Type: ${travelType}
  - Season: ${season}
  - Location Preference: ${locationPreference}
  Provide a brief description of why each destination fits the criteria and a rough cost estimate. Please format the output as JSON.`;

  try {
    const aiResponse = await generateText(prompt);
    res.json({ result: aiResponse });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500);
    throw new Error('Failed to generate recommendations from AI');
  }
});

// @desc    Generate AI Itinerary
// @route   POST /api/ai/itinerary
// @access  Public
export const generateItinerary = asyncHandler(async (req: Request, res: Response) => {
  const { destination, days, interests } = req.body;

  if (!destination || !days || !interests) {
    res.status(400);
    throw new Error('Missing required fields: destination, days, interests');
  }

  const prompt = `Create a detailed ${days}-day travel itinerary for ${destination}. 
  The traveler's interests are: ${interests}. 
  Include day-wise schedules, nearby places, and food recommendations. Format the output in Markdown.`;

  try {
    const aiResponse = await generateText(prompt);
    res.json({ result: aiResponse });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500);
    throw new Error('Failed to generate itinerary from AI');
  }
});

// @desc    Estimate Travel Budget
// @route   POST /api/ai/budget
// @access  Public
export const estimateBudget = asyncHandler(async (req: Request, res: Response) => {
  const { destination, days, travelStyle } = req.body;

  if (!destination || !days || !travelStyle) {
    res.status(400);
    throw new Error('Missing required fields: destination, days, travelStyle');
  }

  const prompt = `Estimate the total trip cost for a ${days}-day trip to ${destination} with a "${travelStyle}" travel style. 
  Break down the costs into: Transport, Hotel, Food, and Activities. 
  Provide cost-saving suggestions.`;

  try {
    const aiResponse = await generateText(prompt);
    res.json({ result: aiResponse });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500);
    throw new Error('Failed to estimate budget from AI');
  }
});

// @desc    Summarize Reviews
// @route   POST /api/ai/review-summary
// @access  Public
export const summarizeReviews = asyncHandler(async (req: Request, res: Response) => {
  const { reviews } = req.body; // Array of review strings

  if (!reviews || reviews.length === 0) {
    res.status(400);
    throw new Error('No reviews provided');
  }

  const prompt = `Here are several user reviews for a travel package:
  ${reviews.map((r: string, i: number) => `Review ${i + 1}: ${r}`).join('\n')}
  
  Please provide a summary of these reviews. Highlight the main Pros and Cons, and determine the overall sentiment (Positive, Neutral, Negative).`;

  try {
    const aiResponse = await generateText(prompt);
    res.json({ result: aiResponse });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500);
    throw new Error('Failed to summarize reviews from AI');
  }
});

// @desc    AI Travel Assistant Chatbot
// @route   POST /api/ai/chatbot
// @access  Public
export const chatWithAssistant = asyncHandler(async (req: Request, res: Response) => {
  const { message, chatHistory } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message field is required');
  }

  const prompt = `You are an AI Travel Assistant for a booking platform. Be polite, helpful, and concise.
  Previous conversation:
  ${chatHistory ? chatHistory : 'None'}
  
  User: ${message}
  Assistant:`;

  try {
    const aiResponse = await generateText(prompt);
    res.json({ result: aiResponse });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500);
    throw new Error('Failed to get response from AI assistant');
  }
});
