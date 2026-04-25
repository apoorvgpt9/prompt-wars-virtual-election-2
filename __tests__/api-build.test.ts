import { describe, it, expect, vi } from 'vitest';
import { POST } from '../app/api/build/route';
import { NextRequest } from 'next/server';

vi.mock('../lib/gemini', () => ({
  callGemini: vi.fn(),
}));

import { callGemini } from '../lib/gemini';

describe('Build API', () => {
  it('returns 200 with valid analysis', async () => {
    const mockContent = {
      title: 'Journey to Democracy',
      modules: [],
      timeline: [],
      estimatedTime: '2 hours'
    };
    
    vi.mocked(callGemini).mockResolvedValue(JSON.stringify(mockContent));

    const req = new NextRequest('http://localhost/api/build', {
      method: 'POST',
      body: JSON.stringify({ 
        analysis: { 
          problemArea: 'EVM', 
          keyDimensions: [], 
          userContext: '', 
          complexity: 'Beginner' 
        } 
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
  });
});
