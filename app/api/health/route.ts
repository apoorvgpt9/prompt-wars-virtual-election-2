import { NextResponse } from 'next/server';

/**
 * GET /api/health
 * Returns the health status of the application.
 */
export const GET = async () => {
  const requestId = crypto.randomUUID();

  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      model: 'gemini-3-flash-preview',
    },
    {
      headers: {
        'X-Request-ID': requestId,
      },
    }
  );
};
