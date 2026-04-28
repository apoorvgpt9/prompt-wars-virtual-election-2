import { NextRequest, NextResponse } from 'next/server';
import { EvaluateRequestSchema, sanitizeInput } from '@/lib/validation';
import { validateInput, validateOutput } from '@/lib/governance';
import { callGemini } from '@/lib/gemini';
import { EVALUATOR_PROMPT } from '@/lib/prompts';
import { ACTIVE_CONFIG } from '@/lib/domain-config';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * POST /api/evaluate
 * Evaluates user interaction or quiz answer.
 */
export const POST = async (request: NextRequest) => {
  const requestId = crypto.randomUUID();
  const headers = { 'X-Request-ID': requestId };
  const startTime = Date.now();

  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers });
    }

    const body = await request.json();
    const result = EvaluateRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid evaluation request' }, { status: 400, headers });
    }

    const { userAnswer, questionContext } = result.data;
    
    // Governance: Input validation & sanitization
    const guardResult = validateInput(userAnswer);
    if (!guardResult.safe) {
      return NextResponse.json({ error: guardResult.reason }, { status: 422, headers });
    }

    // Call Gemini
    const systemPrompt = EVALUATOR_PROMPT(ACTIVE_CONFIG);
    const userMessage = JSON.stringify({ answer: guardResult.sanitized!, context: sanitizeInput(questionContext) });
    const rawOutput = await callGemini(systemPrompt, userMessage);

    // Governance: Output validation
    const outputGuard = validateOutput(rawOutput);
    if (!outputGuard.valid) {
      return NextResponse.json({ error: outputGuard.reason }, { status: 502, headers });
    }

    console.log(JSON.stringify({
      severity: 'INFO',
      service: 'elected',
      route: '/api/evaluate',
      durationMs: Date.now() - startTime,
      requestId,
    }));
    return NextResponse.json({ evaluation: outputGuard.data }, { headers });
  } catch (error: unknown) {
    const message = error instanceof Error && error.message === 'Failed to parse AI response'
                   ? error.message 
                   : 'An internal error occurred';
    
    const status = message === 'An internal error occurred' ? 500 : 502;
    return NextResponse.json({ error: message }, { status, headers });
  }
};
