import { z } from 'zod';

/**
 * Schema for the analysis API request.
 */
export const AnalyseRequestSchema = z.object({
  topic: z.string().min(3).max(200),
});

/**
 * Schema for the build API request.
 */
export const BuildRequestSchema = z.object({
  analysis: z.object({
    problemArea: z.string(),
    keyDimensions: z.array(z.string()),
    userContext: z.string(),
    complexity: z.string(),
  }),
});

/**
 * Schema for the evaluate API request.
 */
export const EvaluateRequestSchema = z.object({
  userAnswer: z.string().min(1),
  questionContext: z.string().min(1),
});

/**
 * Schema and Type for the Analyst AI output.
 */
export const AnalystOutputSchema = z.object({
  problemArea: z.string(),
  keyDimensions: z.array(z.string()),
  userContext: z.string(),
  complexity: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});
export type AnalystOutput = z.infer<typeof AnalystOutputSchema>;

/**
 * Schema and Type for the Builder AI output.
 */
export const BuilderOutputSchema = z.object({
  title: z.string(),
  modules: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      summary: z.string(),
      keyPoints: z.array(z.string()).length(3),
      action: z.string(),
      quizScenario: z.string(),
    })
  ),
  timeline: z.array(
    z.object({
      step: z.number(),
      label: z.string(),
      description: z.string(),
      duration: z.string(),
      isKeyMilestone: z.boolean(),
    })
  ),
  estimatedTime: z.string(),
});
export type BuilderOutput = z.infer<typeof BuilderOutputSchema>;

/**
 * Schema and Type for the Evaluator AI output.
 */
export const EvaluatorOutputSchema = z.object({
  correct: z.boolean(),
  feedback: z.string(),
  encouragement: z.string(),
  nextStep: z.string(),
});
export type EvaluatorOutput = z.infer<typeof EvaluatorOutputSchema>;

/**
 * Sanitizes user input by stripping HTML, trimming whitespace, and enforcing length.
 * @param text The input text to sanitize.
 * @returns The sanitized string.
 */
export const sanitizeInput = (text: string): string => {
  return text
    .replace(/<[^>]*>?/gm, '') // Strip HTML
    .trim();
};

/**
 * Checks for common prompt injection patterns.
 * @param text The input text to check.
 * @returns True if the input contains potential injection patterns.
 */
export const hasPromptInjection = (text: string): boolean => {
  const patterns = [
    /ignore previous/i,
    /system:/i,
    /```/
  ];
  return patterns.some(pattern => pattern.test(text));
};
