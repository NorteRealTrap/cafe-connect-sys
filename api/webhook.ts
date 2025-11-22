import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const processedWebhooks = new Map<string, any>();
const rateLimits = new Map<string, number[]>();

// CORS seguro
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [];

function setCORSHeaders(res: VercelResponse, origin: string | undefined): void {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Hub-Signature-256');
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 50;
  
  const requests = (rateLimits.get(ip) || []).filter(t => t > now - windowMs);
  
  if (requests.length >= maxRequests) {
    return false;
  }
  
  requests.push(now);
  rateLimits.set(ip, requests);
  return true;
}

function checkIdempotency(webhookId: string): any | null {
  return processedWebhooks.get(webhookId) || null;
}

function saveIdempotency(webhookId: string, result: any): void {
  processedWebhooks.set(webhookId, result);
  
  if (processedWebhooks.size > 1000) {
    const firstKey = processedWebhooks.keys().next().value;
    processedWebhooks.delete(firstKey);
  }
}

/**
 * Validar assinatura do webhook do Meta/Facebook
 */
function verifyWebhookSignature(
  payload: string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature) {
    return false;
  }

  try {
    // Remover prefixo "sha256="
    const receivedSignature = signature.replace('sha256=', '');
    
    // Calcular hash esperado
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Comparação segura (timing-safe)
    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  setCORSHeaders(res, origin);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ip = (req.headers['x-forwarded-for'] as string) || 'unknown';
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  if (req.method === 'GET') {
    // Verificação do webhook WhatsApp/Instagram
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN;
    
    if (!verifyToken) {
      console.error('WEBHOOK_VERIFY_TOKEN não configurado');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (mode === 'subscribe' && token === verifyToken) {
      return res.status(200).send(challenge);
    }
    
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'POST') {
    try {
      const webhookId = req.headers['x-webhook-id'] as string;
      
      if (webhookId) {
        const existing = checkIdempotency(webhookId);
        if (existing) {
          return res.status(200).json(existing);
        }
      }
      
      const signature = req.headers['x-hub-signature-256'] as string;
      const appSecret = process.env.WHATSAPP_APP_SECRET || process.env.INSTAGRAM_APP_SECRET;
      
      // Obter payload como string para validação
      const rawBody = typeof req.body === 'string' 
        ? req.body 
        : JSON.stringify(req.body);

      // Validar assinatura se secret estiver configurado
      if (appSecret && !verifyWebhookSignature(rawBody, signature, appSecret)) {
        console.warn('Webhook signature inválida');
        return res.status(403).json({ error: 'Invalid signature' });
      }

      const data = typeof req.body === 'object' ? req.body : JSON.parse(rawBody);

      if (data.object === 'whatsapp_business_account') {
        const messages = data.entry?.[0]?.changes?.[0]?.value?.messages || [];
        messages.forEach((msg: any) => {
          console.log('WhatsApp message received');
        });
      }

      if (data.object === 'instagram') {
        const messaging = data.entry?.[0]?.messaging || [];
        messaging.forEach((msg: any) => {
          console.log('Instagram message received');
        });
      }

      const result = { success: true };
      
      if (webhookId) {
        saveIdempotency(webhookId, result);
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error('Webhook error:', {
        message: error instanceof Error ? error.message : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
