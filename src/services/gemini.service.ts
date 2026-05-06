import { GoogleGenerativeAI } from '@google/generative-ai';
import AIUsage from '../models/aiUsage.model.ts';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const generateText = async (
  prompt: string,
  endpoint: string = 'general',
  userId?: string
): Promise<string> => {
  const startTime = Date.now();

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error('Empty response from Gemini API');

    const responseTime = Date.now() - startTime;

    // Track usage (non-blocking)
    AIUsage.create({
      endpoint,
      user: userId || undefined,
      prompt: prompt.slice(0, 200),
      tokensUsed: Math.round(prompt.length / 4 + text.length / 4),
      responseTime,
      success: true,
    }).catch(() => {}); // silently fail

    return text;
  } catch (error) {
    const responseTime = Date.now() - startTime;

    // Track failed usage
    AIUsage.create({
      endpoint,
      user: userId || undefined,
      responseTime,
      success: false,
      error: error instanceof Error ? error.message.slice(0, 200) : 'Unknown error',
    }).catch(() => {});

    console.error('Gemini Service Error:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) throw new Error('Gemini API key is invalid or missing');
      if (error.message.includes('rate')) throw new Error('Gemini API rate limit exceeded. Please try again later');
      throw new Error(`AI Error: ${error.message}`);
    }

    throw new Error('Failed to generate content from Gemini AI. Please try again.');
  }
};
