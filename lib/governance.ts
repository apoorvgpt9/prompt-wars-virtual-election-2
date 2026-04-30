/** Input/output governance layer — validates and sanitises all AI traffic before and after Gemini calls. */
import { sanitizeInput, hasPromptInjection } from './validation';

/**
 * Result returned by {@link validateInput} after the Layer-1 gate check.
 */
export interface InputGuardResult {
  /** Whether the input passed all safety and domain checks. */
  safe: boolean;
  /** Human-readable explanation when `safe` is false. */
  reason?: string;
  /** Sanitized version of the original input, present only when `safe` is true. */
  sanitized?: string;
}

/**
 * Result returned by {@link validateOutput} after the Layer-3 gate check.
 */
export interface OutputGuardResult {
  /** Whether the AI output passed all validity and length checks. */
  valid: boolean;
  /** The parsed JSON payload, present only when `valid` is true. */
  data?: unknown;
  /** Human-readable explanation when `valid` is false. */
  reason?: string;
  /** True when the AI returned an OUT_OF_DOMAIN error sentinel. */
  outOfDomain?: boolean;
  /** True when the AI returned an UNSAFE_INPUT error sentinel. */
  unsafeInput?: boolean;
}

const ELECTION_KEYWORDS = /elect|vote|voter|ballot|candidate|polling|booth|evm|vvpat|eci|commission|constituency|parliament|lok\s?sabha|vidhan|assembly|nomination|campaign|result|count|register|registration|civic|democracy|democratic|party|manifesto|mcc|model\s?code|form\s?6|process|rules|rights|conduct|booth|station/i;

/**
 * Sanitises raw user text, enforces 3–200 character bounds, detects prompt-injection,
 * and confirms the query is relevant to the Indian election domain.
 * @param text - Raw input string submitted by the user.
 * @returns An {@link InputGuardResult} indicating whether the input is safe to forward to Gemini.
 */
export const validateInput = (text: string): InputGuardResult => {
  const sanitized = sanitizeInput(text);

  if (sanitized.length < 3)
    return { safe: false, reason: 'Input is too short.' };

  if (sanitized.length > 200)
    return { safe: false, reason: 'Input exceeds the 200 character limit.' };

  if (hasPromptInjection(sanitized))
    return { safe: false, reason: 'Input contains disallowed content.' };

  if (!ELECTION_KEYWORDS.test(sanitized))
    return { safe: false, reason: 'Please enter a question about the Indian election process.' };

  return { safe: true, sanitized };
};

/**
 * Strips markdown fences, JSON-parses the AI response, checks for sentinel error
 * values (OUT_OF_DOMAIN / UNSAFE_INPUT), and enforces per-field length limits.
 * @param text - Raw text string returned by the Gemini model.
 * @returns An {@link OutputGuardResult} with the parsed payload on success,
 *   or a failure description with optional sentinel flags on error.
 */
export const validateOutput = (text: string): OutputGuardResult => {
  let parsed: unknown;
  try {
    let clean = text.trim();
    // Try to extract JSON if it's wrapped in other text or markdown
    const jsonMatch = clean.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      clean = jsonMatch[0];
    }
    parsed = JSON.parse(clean);
  } catch (err) {
    console.error('JSON Parse Error:', err);
    console.error('Raw AI Text that failed to parse:', text);
    return { valid: false, reason: 'AI returned an unexpected response format.' };
  }

  if (typeof parsed === 'object' && parsed !== null && 'error' in parsed) {
    const err = (parsed as { error: string }).error;
    if (err === 'OUT_OF_DOMAIN')
      return { valid: false, outOfDomain: true, reason: 'This question is outside the scope of ElectEd.' };
    if (err === 'UNSAFE_INPUT')
      return { valid: false, unsafeInput: true, reason: 'Your input could not be processed. Please rephrase.' };
  }

  for (const [key, val] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof val === 'string' && val.length > 1000)
      return { valid: false, reason: `Response field "${key}" exceeded allowed length.` };
  }

  return { valid: true, data: parsed };
};