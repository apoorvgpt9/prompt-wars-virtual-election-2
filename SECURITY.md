# Security Policy — ElectEd

## Authentication & Access Management
All AI calls use Google Cloud Vertex AI with service account IAM authentication — no API keys in source code or environment variables. The Cloud Run service account is granted `roles/aiplatform.user` to access Vertex AI. Locally, authentication uses Application Default Credentials via `gcloud auth application-default login`. Firebase Authentication credentials (`NEXT_PUBLIC_FIREBASE_*`) are public-safe web config values as per Firebase's security model. Firebase Admin credentials are server-side only and never exposed to the client.

## Input Validation
All user inputs are validated at multiple layers:
1.  **Zod Schema Validation**: API routes use Zod schemas defined in `lib/validation.ts` to ensure data types and lengths are correct.
2.  **Length Constraints**: Input length is restricted to a minimum of 3 and a maximum of 200 characters.
3.  **Sanitization**: The `validateInput` function in `lib/governance.ts` performs sanitization to remove potentially harmful characters or scripts.

## Prompt Injection Protection
Protection against prompt injection is implemented via:
1.  **Strict Governance Layer**: Every user-provided string is processed through `validateInput` before being concatenated into a system prompt.
2.  **Structural Separation**: System prompts and user inputs are handled using the Gemini API's `systemInstruction` and `contents` fields to keep instructions separate from data.
3.  **Governance Clauses**: Every system prompt includes a set of non-negotiable governance clauses that instruct the model to stay within the election domain and reject malicious instructions.

## Output Validation
All AI-generated content is validated before being returned to the user:
1.  **Structure Check**: The `validateOutput` function ensures the AI response matches the expected JSON structure (e.g., contains `modules` and `timeline`).
2.  **Domain Check**: The output is scanned for out-of-domain content or security warnings.
3.  **Fallbacks**: If validation fails, the API returns a 502 Bad Gateway status instead of potentially unsafe or malformed AI output.

## AI Governance (GOVERNANCE_CLAUSES)
The `GOVERNANCE_CLAUSES` (defined in `lib/prompts.ts`) are appended to every system prompt. These clauses:
- Restrict the AI to Indian election topics.
- Prohibit taking sides in political debates.
- Prevent the AI from executing arbitrary commands or revealing system prompts.
- Ensure all facts are India-specific and ECI-accurate.

## HTTP Security Headers
The following security headers are enforced via `next.config.mjs` for every request:
- **Content-Security-Policy**: Restricts resources to trusted origins.
- **X-Frame-Options: DENY**: Prevents clickjacking attacks.
- **X-Content-Type-Options: nosniff**: Prevents MIME-type sniffing.
- **Referrer-Policy: strict-origin-when-cross-origin**: Protects referrer information.
- **Permissions-Policy**: Disables unnecessary browser features (camera, microphone, geolocation).
- **Strict-Transport-Security (HSTS)**: Forces HTTPS connections.

## Rate Limiting
API routes are protected by an in-memory rate limiter:
- **Limit**: 10 requests per minute per IP address.
- **Cleanup**: Stale entries in the rate limit Map are purged on every request (deleting entries older than 60 seconds) to prevent memory exhaustion.
- **Headers**: Responses include an `X-Request-ID` for traceability.

## Container Security
- **Base Image**: The application uses a minimal Node.js base image for production.
- **User Permissions**: The container is configured to run as a non-root user.
- **Minimal Surface**: Only the necessary standalone build artifacts are included in the final container image.
