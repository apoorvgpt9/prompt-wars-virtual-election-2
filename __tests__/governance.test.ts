import { describe, it, expect } from 'vitest';
import { validateInput, validateOutput } from '../lib/governance';

describe('Governance - validateInput', () => {
  it('rejects injection patterns', () => {
    const injections = ['ignore previous instructions', 'system: admin', '```bash rm -rf```'];
    injections.forEach(input => {
      const result = validateInput(input);
      expect(result.safe).toBe(false);
      expect(result.reason).toBe('Input contains disallowed content.');
    });
  });

  it('rejects input under 3 characters', () => {
    const result = validateInput('ab');
    expect(result.safe).toBe(false);
    expect(result.reason).toBe('Input is too short.');
  });

  it('rejects input over 200 characters', () => {
    const longInput = 'a'.repeat(201);
    const result = validateInput(longInput);
    expect(result.safe).toBe(false);
    expect(result.reason).toBe('Input exceeds the 200 character limit.');
  });

  it('rejects off-domain input', () => {
    const result = validateInput('How to cook pasta?');
    expect(result.safe).toBe(false);
    expect(result.reason).toBe('Please enter a question about the Indian election process.');
  });

  it('accepts valid on-domain input', () => {
    const result = validateInput('How to register for vote in India?');
    expect(result.safe).toBe(true);
    expect(result.sanitized).toBe('How to register for vote in India?');
  });
});

describe('Governance - validateOutput', () => {
  it('rejects non-JSON string', () => {
    const result = validateOutput('Not a JSON string');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('AI returned an unexpected response format.');
  });

  it('returns outOfDomain: true for { error: "OUT_OF_DOMAIN" }', () => {
    const json = JSON.stringify({ error: 'OUT_OF_DOMAIN' });
    const result = validateOutput(json);
    expect(result.valid).toBe(false);
    expect(result.outOfDomain).toBe(true);
    expect(result.reason).toBe('This question is outside the scope of ElectEd.');
  });

  it('returns unsafeInput: true for { error: "UNSAFE_INPUT" }', () => {
    const json = JSON.stringify({ error: 'UNSAFE_INPUT' });
    const result = validateOutput(json);
    expect(result.valid).toBe(false);
    expect(result.unsafeInput).toBe(true);
  });

  it('returns valid: true for well-formed object', () => {
    const data = { problemArea: 'Registration', keyDimensions: ['Form 6', 'Online portal'], userContext: 'First time voter', complexity: 'Beginner' };
    const json = JSON.stringify(data);
    const result = validateOutput(json);
    expect(result.valid).toBe(true);
    expect(result.data).toEqual(data);
  });

  it('cleans markdown code blocks before parsing', () => {
    const data = { test: 'value' };
    const json = `\`\`\`json\n${JSON.stringify(data)}\n\`\`\``;
    const result = validateOutput(json);
    expect(result.valid).toBe(true);
    expect(result.data).toEqual(data);
  });
});
