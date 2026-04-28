import { NextResponse } from 'next/server';

/**
 * GET /api/health
 * Returns the health status and service manifest for ElectEd.
 */
export const GET = async () => {
  const requestId = crypto.randomUUID();
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      model: 'gemini-2.5-pro',
      services: [
        'Google Cloud Run',
        'Vertex AI',
        'Firebase Authentication',
        'Cloud Firestore',
        'Cloud Logging',
        'Cloud IAM',
        'Cloud Build',
      ],
      region: 'us-central1',
    },
    { headers: { 'X-Request-ID': requestId } }
  );
};
