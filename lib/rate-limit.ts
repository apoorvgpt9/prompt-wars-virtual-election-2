/** In-memory sliding-window rate limiter for Next.js API routes. */

/** Tracks request counts and reset timestamps keyed by IP address. */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

/**
 * Checks if a request from a specific IP should be rate limited.
 * Also performs periodic cleanup of stale entries.
 * @param ip The IP address of the requester.
 * @param limit The maximum number of requests allowed per minute.
 * @returns True if the request is allowed, false if it should be rate limited.
 */
export const checkRateLimit = (ip: string, limit: number = 100): boolean => {
  const now = Date.now();
  const windowMs = 60000;

  // Cleanup stale entries on every request
  rateLimitMap.forEach((entry, key) => {
    if (now - entry.lastReset > windowMs) {
      rateLimitMap.delete(key);
    }
  });

  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.lastReset > windowMs) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count += 1;
  return true;
};
