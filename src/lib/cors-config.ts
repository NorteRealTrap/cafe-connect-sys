/**
 * Configuração segura de CORS
 */
const allowedOrigins = [
  'https://seu-dominio.com',
  'https://www.seu-dominio.com',
  process.env.NODE_ENV === 'development' && 'http://localhost:5173',
].filter(Boolean) as string[];

export function configureCORS(req: any, res: any) {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return null;
}
