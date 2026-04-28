import { sanitizeInput, hasPromptInjection } from './validation';

export interface InputGuardResult {
  safe: boolean;
  reason?: string;
  sanitized?: string;
}

export interface OutputGuardResult {
  valid: boolean;
  data?: unknown;
  reason?: string;
  outOfDomain?: boolean;
  unsafeInput?: boolean;
}

const ELECTION_KEYWORDS = /elect|vote|voter|ballot|candidate|polling|booth|evm|vvpat|eci|commission|constituency|parliament|lok\s?sabha|vidhan|assembly|nomination|campaign|result|count|register|registration|civic|democracy|democratic|party|manifesto|mcc|model\s?code|form\s?6|process|rules|rights|conduct|booth|station/i;

/** validateInput — Layer 1 input gate */
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

/** validateOutput — Layer 3 output gate */
export const validateOutput = (text: string): OutputGuardResult => {
  let parsed: unknown;
  try {
    const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    parsed = JSON.parse(clean);
  } catch {
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