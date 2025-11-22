import { VercelRequest, VercelResponse } from '@vercel/node';

export interface SecurityConfig {
  allowedOrigins: string[];
  maxRequestsPerWindow: number;
  windowMs: number;
}

const defaultConfig: SecurityConfig = {
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  maxRequestsPerWindow: 100,
  windowMs: 15 * 60 * 1000
};

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function validateOrigin(req: VercelRequest, res: VercelResponse, config = defaultConfig): boolean {
  const origin = req.headers.origin;
  
  if (origin && config.allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return true;
  }
  
  return false;
}

export function rateLimit(identifier: string, config = defaultConfig): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequestsPerWindow - 1 };
  }

  if (record.count >= config.maxRequestsPerWindow) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: config.maxRequestsPerWindow - record.count };
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function getClientIdentifier(req: VercelRequest): string {
  return (req.headers['x-forwarded-for'] as string) || 
         (req.headers['x-real-ip'] as string) || 
         req.socket?.remoteAddress || 
         'unknown';
}
