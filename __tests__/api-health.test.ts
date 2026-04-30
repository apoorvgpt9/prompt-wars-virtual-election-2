import { describe, it, expect, vi } from 'vitest';
import { GET } from '../app/api/health/route';

// Mock crypto.randomUUID for consistency
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid'
});

describe('API - Health', () => {
  it('returns 200 with status ok', async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(body.model).toBe('gemini-2.5-pro');
    expect(response.headers.get('X-Request-ID')).toBe('test-uuid');
  });
});
