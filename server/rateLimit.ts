import type { RequestHandler } from 'express';

interface Options {
  max: number;
  windowMs: number;
}

/**
 * Minimal fixed-window, in-memory rate limiter keyed by client IP.
 * Sufficient for a single-instance deployment; swap for a shared store if scaled out.
 */
export function rateLimit({ max, windowMs }: Options): RequestHandler {
  const hits = new Map<string, { count: number; resetAt: number }>();

  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) if (entry.resetAt <= now) hits.delete(key);
  }, windowMs);
  sweep.unref();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip ?? 'unknown';
    const entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (entry.count >= max) {
      res.setHeader('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ error: 'Too many requests. Please slow down and try again shortly.' });
    }
    entry.count += 1;
    next();
  };
}
