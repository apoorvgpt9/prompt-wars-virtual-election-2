import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initializes the Gemini API client.
 * GEMINI_API_KEY is accessed only via process.env.GEMINI_API_KEY server-side.
 * Never import or use this in client components.
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Calls the Gemini API with a system prompt and user message.
 * Uses gemini-3-flash-preview with a configurable timeout (default 30 seconds).
 * Errors are caught and re-thrown as safe generic messages.
 * @param systemPrompt The instruction for the AI agent.
 * @param userMessage The user's input or context to process.
 * @param timeoutMs Timeout in milliseconds. Default is 30000 (30 seconds).
 * @returns The AI's response as a raw text string.
 */
export const callGemini = async (
  systemPrompt: string,
  userMessage: string,
  timeoutMs: number = 30000,
  retries: number = 3
): Promise<string> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-3-flash-preview',
        systemInstruction: systemPrompt,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      });

      clearTimeout(timeoutId);
      return result.response.text();

    } catch (error: unknown) {
      // TEMPORARY: Added for development debugging. REMOVE BEFORE DEPLOYMENT.
      console.error('[Gemini API Error]:', error);

      const isThrottled = error instanceof Error && (
        error.message.includes('503') || 
        error.message.includes('429') ||
        error.message.includes('RESOURCE_EXHAUSTED')
      );
      const isLastAttempt = attempt === retries;

      if (isThrottled && !isLastAttempt) {
        // Exponential backoff: 2s, 4s, 8s...
        await new Promise(res => setTimeout(res, 2000 * attempt));
        continue;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('AI request timed out');
      }
      throw new Error('Failed to communicate with AI service');
    }
  }
  throw new Error('Failed to communicate with AI service');
}

/**
 * Streaming variant of the Gemini API call.
 * Yields response text chunks as they arrive from the API.
 * Use this for long-form content where progressive rendering improves UX.
 * @param systemPrompt The instruction for the AI agent.
 * @param userMessage The user's input or context to process.
 * @returns An async generator yielding response text chunks.
 */
export async function* streamGemini(
  systemPrompt: string,
  userMessage: string
): AsyncGenerator<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    systemInstruction: systemPrompt,
  });

  try {
    const result = await model.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error: unknown) {
    // TEMPORARY: Added for development debugging. REMOVE BEFORE DEPLOYMENT.
    console.error('[Gemini Stream Error]:', error);
    throw new Error('Failed to stream AI response');
  }
}