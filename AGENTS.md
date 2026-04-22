# ElectEd — Agent rules

## Project identity
- App name: ElectEd
- Purpose: Indian election process education
- Stack: Next.js 14 App Router, TypeScript strict, Tailwind CSS, shadcn/ui, Vitest
- Target deployment: Google Cloud Run (asia-south1)

## Code standards
- TypeScript strict mode always — never use `any`, never suppress type errors
- All exported functions must have JSDoc comments explaining role and design rationale
- Prefer `const` over `let` — never use `var`
- Arrow functions for all callbacks and component definitions
- 2-space indentation, single quotes for strings
- File naming: kebab-case for components (election-timeline.tsx), camelCase for lib files

## Architecture rules — never violate these
- GEMINI_API_KEY is accessed only via `process.env.GEMINI_API_KEY` server-side
- Never import GEMINI_API_KEY or any secret in any client component or page
- All Gemini system prompts live in /lib/prompts.ts as named exports — never inline
- All input to Gemini must pass through validateInput() from /lib/governance.ts first
- All output from Gemini must pass through validateOutput() from /lib/governance.ts
- GOVERNANCE_CLAUSES must be appended to every system prompt — no exceptions
- Zod schemas for every API request and response shape — defined in /lib/validation.ts

## API route rules
- Every POST route: validate with Zod → sanitize with validateInput → call Gemini → validateOutput
- Rate limit: 10 requests per minute per IP via in-memory Map with 60-second cleanup
- Every route adds X-Request-ID response header
- Return 400 for input validation failures, 422 for outOfDomain, 429 for rate limit, 502 for output failures
- Never expose stack traces, file paths, or internal error messages in any response body

## Testing rules
- Every new function in /lib/ must have at least one corresponding test
- Gemini API must always be mocked in tests — never make real API calls in test suite
- governance.test.ts tests must be deterministic — no mocking needed for validateInput/validateOutput
- `npm test` must exit 0 before any deployment

## Security rules
- No hardcoded secrets anywhere in source code
- .env.local must be in .gitignore — verify before every commit
- Input length: min 3, max 200 chars enforced at API layer independently of client
- All 6 security headers must be present in next.config.ts

## UI rules
- This is a workflow tool — NOT a chat interface. Users click and select, not type conversations.
- One h1 per page. Logical h2/h3 hierarchy. No heading level skips.
- Every interactive element must be keyboard accessible
- aria-live="polite" on all dynamic regions that update after AI responses
- Skeleton loaders between every agent call — never show blank space while loading
- ElectionTimeline component must render visually (circles, lines) — never as a bullet list

## What to do when uncertain
- If a requirement is ambiguous, implement the more secure/accessible option
- If a file already exists, read it before modifying — never overwrite without checking
- If a test is failing, fix the implementation, not the test
- Never delete files without explicit instruction