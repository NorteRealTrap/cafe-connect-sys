/**
 * Rate limiter simples baseado em memória
 * Para produção, usar Redis (@upstash/ratelimit)
 */
const requests = new Map<string, number[]>();

export function rateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Limpar requisições antigas
  const userRequests = (requests.get(identifier) || []).filter(
    (timestamp) => timestamp > windowStart
  );

  if (userRequests.length >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  userRequests.push(now);
  requests.set(identifier, userRequests);

  return {
    allowed: true,
    remaining: maxRequests - userRequests.length,
  };
}

/**
 * Middleware de rate limit para APIs
 */
export function rateLimitMiddleware(req: any, res: any) {
  const identifier = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const { allowed, remaining } = rateLimit(identifier);

  res.setHeader('X-RateLimit-Remaining', remaining.toString());

  if (!allowed) {
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: 900, // 15 min
    });
  }

  return null;
}
