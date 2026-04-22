# GEMINI.md — Antigravity-specific rules for ElectEd

## Planning Mode behaviour
- Always create a detailed implementation plan before writing any code
- List every file that will be created or modified in the plan
- Wait for approval before executing if in Review-driven mode

## Code generation priorities
1. Correctness and type safety first
2. Security (governance layer, no exposed secrets)
3. Accessibility (ARIA, keyboard nav)
4. Then performance and polish

## ElectEd-specific Gemini prompt rules
- Model string in /lib/gemini.ts must be exactly: "gemini-3-flash-preview"
- The BUILDER prompt must always return both `modules` and `timeline` arrays
- Timeline array must have 6–8 items for election topics — never fewer
- All election facts must be India-specific and ECI-accurate — never generic

## Terminal commands that are always safe to run without asking
- npm install, npm run dev, npm run build, npm run lint, npm test
- gcloud config list (read-only)

## Terminal commands that require explicit user confirmation before running
- gcloud run deploy (deployment — user must confirm)
- gcloud secrets create (secret creation — user must confirm)
- rm -rf (destructive — always confirm)
- Any git push or git commit

## Never do these
- Never add console.log to production code (use proper error handling)
- Never use inline styles — always Tailwind classes
- Never create a .env file — only .env.local
- Never commit node_modules or .next directory