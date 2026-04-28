import { VertexAI } from '@google-cloud/vertexai';

/**
 * Calls Gemini Pro via Vertex AI using service account IAM auth.
 * No API key required — authenticates via Application Default Credentials.
 * The VertexAI client is instantiated lazily at call-time so that the
 * Next.js build phase does not require GOOGLE_CLOUD_PROJECT to be set.
 * Retries up to 3 times on 503 with exponential backoff.
 * @param systemPrompt The instruction for the AI agent.
 * @param userMessage The user's input or context to process.
 * @param timeoutMs Timeout in milliseconds. Default is 30000 (30 seconds).
 * @param retries Number of retry attempts on transient failures. Default is 3.
 * @returns The AI's response as a raw text string.
 */
export const callGemini = async (
  systemPrompt: string,
  userMessage: string,
  timeoutMs = 30000,
  retries = 3
): Promise<string> => {
  const vertex = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT!,
    location: process.env.VERTEX_LOCATION || 'us-central1',
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const model = vertex.getGenerativeModel({
        model: 'gemini-2.5-pro',
        systemInstruction: {
          role: 'system',
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.3,
        },
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      });

      clearTimeout(timeoutId);
      return result.response.candidates![0].content.parts[0].text!;

    } catch (error: unknown) {
      console.error('GEMINI ERROR:', error);  // ADD THIS LINE
      const is503 = error instanceof Error && error.message.includes('503');
      const isLastAttempt = attempt === retries;
      if (is503 && !isLastAttempt) {
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
};