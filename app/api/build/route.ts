import { NextRequest, NextResponse } from 'next/server';
import { BuildRequestSchema } from '@/lib/validation';
import { validateOutput } from '@/lib/governance';
import { callGemini } from '@/lib/gemini';
import { BUILDER_PROMPT } from '@/lib/prompts';
import { ACTIVE_CONFIG } from '@/lib/domain-config';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * POST /api/build
 * Generates structured educational content using the analyst's output.
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
    const result = BuildRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid analysis data' }, { status: 400, headers });
    }

    const { analysis } = result.data;
    
    // Call Gemini
    const systemPrompt = BUILDER_PROMPT(ACTIVE_CONFIG, analysis);
    const rawOutput = await callGemini(systemPrompt, 'Generate structured content');

    // Governance: Output validation
    const outputGuard = validateOutput(rawOutput);
    if (!outputGuard.valid) {
      return NextResponse.json({ error: outputGuard.reason }, { status: 502, headers });
    }

    console.log(JSON.stringify({
      severity: 'INFO',
      service: 'elected',
      route: '/api/build',
      durationMs: Date.now() - startTime,
      requestId,
    }));
    return NextResponse.json({ content: outputGuard.data }, { headers });
  } catch (error: unknown) {
    const message = error instanceof Error && error.message === 'Failed to parse AI response'
                   ? error.message 
                   : 'An internal error occurred';
    
    const status = message === 'An internal error occurred' ? 500 : 502;
    return NextResponse.json({ error: message }, { status, headers });
  }
};
