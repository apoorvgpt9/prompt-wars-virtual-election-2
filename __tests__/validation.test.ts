import { describe, it, expect } from 'vitest';
import { AnalyseRequestSchema, BuildRequestSchema, sanitizeInput } from '../lib/validation';

describe('Validation - AnalyseRequestSchema', () => {
  it('rejects missing topic', () => {
    const result = AnalyseRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects topic under 3 characters', () => {
    const result = AnalyseRequestSchema.safeParse({ topic: 'ab' });
    expect(result.success).toBe(false);
  });

  it('rejects topic over 200 characters', () => {
    const result = AnalyseRequestSchema.safeParse({ topic: 'a'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('accepts valid topic', () => {
    const result = AnalyseRequestSchema.safeParse({ topic: 'Voter ID registration' });
    expect(result.success).toBe(true);
  });
});

describe('Validation - BuildRequestSchema', () => {
  it('rejects missing analysis', () => {
    const result = BuildRequestSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('accepts well-formed analysis object', () => {
    const validAnalysis = {
      problemArea: 'EVM Security',
      keyDimensions: ['Hardware', 'Software', 'Chain of custody'],
      userContext: 'Tech curious citizen',
      complexity: 'Intermediate'
    };
    const result = BuildRequestSchema.safeParse({ analysis: validAnalysis });
    expect(result.success).toBe(true);
  });
});

describe('Validation - sanitizeInput', () => {
  it('strips HTML tags', () => {
    const input = '<script>alert("xss")</script>Hello <b>World</b>';
    expect(sanitizeInput(input)).toBe('alert("xss")Hello World');
  });

  it('trims whitespace', () => {
    const input = '   election news   ';
    expect(sanitizeInput(input)).toBe('election news');
  });

  it('handles empty input', () => {
    expect(sanitizeInput('')).toBe('');
  });
});
