import crypto from 'crypto';

/**
 * Verifica assinatura de webhook do WhatsApp/Instagram
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature) return false;

  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature === `sha256=${hash}`;
}

/**
 * Middleware para validar webhooks
 */
export function validateWebhook(req: any, secret: string): boolean {
  const signature = req.headers['x-hub-signature-256'];
  const body = JSON.stringify(req.body);
  
  return verifyWebhookSignature(body, signature, secret);
}
