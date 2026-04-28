import { NextRequest, NextResponse } from 'next/server';
import { AnalyseRequestSchema } from '@/lib/validation';
import { validateInput, validateOutput } from '@/lib/governance';
import { callGemini } from '@/lib/gemini';
import { ANALYST_PROMPT } from '@/lib/prompts';
import { ACTIVE_CONFIG } from '@/lib/domain-config';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * POST /api/analyse
 * Decomposes user input into key dimensions using Gemini.
 */
export const POST = async (request: NextRequest) => {
  const requestId = crypto.randomUUID();
  const headers = { 'X-Request-ID': requestId };
  const startTime = Date.now();

  try {
    // Rate limit check
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers });
    }

    // Body validation
    const body = await request.json();
    const result = AnalyseRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input topic' }, { status: 400, headers });
    }

    const { topic } = result.data;
    
    // Governance: Input validation & sanitization
    const guardResult = validateInput(topic);
    if (!guardResult.safe) {
      return NextResponse.json({ error: guardResult.reason }, { status: 422, headers });
    }

    // Call Gemini
    const systemPrompt = ANALYST_PROMPT(ACTIVE_CONFIG);
    const rawOutput = await callGemini(systemPrompt, guardResult.sanitized!);

    // Governance: Output validation
    const outputGuard = validateOutput(rawOutput);
    if (!outputGuard.valid) {
      return NextResponse.json({ error: outputGuard.reason }, { status: 502, headers });
    }

    console.log(JSON.stringify({
      severity: 'INFO',
      service: 'elected',
      route: '/api/analyse',
      durationMs: Date.now() - startTime,
      requestId,
    }));
    return NextResponse.json({ analysis: outputGuard.data }, { headers });
  } catch (error: unknown) {
    const message = error instanceof Error && (
      error.message === 'Potential security threat detected' || 
      error.message === 'Input too short' ||
      error.message === 'Please enter a question about the Indian election process.'
    ) ? error.message : 'An internal error occurred';
    
    const status = message === 'An internal error occurred' ? 500 : 422;
    return NextResponse.json({ error: message }, { status, headers });
  }
};
