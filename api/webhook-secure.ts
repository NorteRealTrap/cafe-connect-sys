import { validateWebhook } from '../src/lib/webhook-security';
import { rateLimitMiddleware } from '../src/lib/rate-limit';
import { logger } from '../src/lib/logger';

/**
 * Webhook seguro com validação de assinatura e rate limiting
 */
export default async function handler(req: any, res: any) {
  // Rate limiting
  const rateLimitError = rateLimitMiddleware(req, res);
  if (rateLimitError) return rateLimitError;

  // Validar assinatura
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    logger.error('WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  if (!validateWebhook(req, secret)) {
    logger.warn('Invalid webhook signature', {
      headers: req.headers,
      ip: req.headers['x-forwarded-for'],
    });
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Idempotência - verificar se já processamos
  const webhookId = req.headers['x-webhook-id'];
  if (webhookId) {
    // TODO: Verificar no banco se já processamos este webhook
    // const existing = await db.processedWebhooks.findUnique({ where: { webhookId } });
    // if (existing) return res.json(existing.result);
  }

  try {
    // Processar webhook
    const data = req.body;
    
    logger.info('Webhook received', {
      type: data.object,
      webhookId,
    });

    // TODO: Implementar lógica de processamento
    const result = { success: true };

    // Salvar que processamos
    if (webhookId) {
      // await db.processedWebhooks.create({ data: { webhookId, result } });
    }

    return res.status(200).json(result);
  } catch (error) {
    logger.error('Webhook processing failed', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      body: req.body,
    });

    return res.status(500).json({ error: 'Processing failed' });
  }
}
