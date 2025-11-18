import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Verificação do webhook WhatsApp/Instagram
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'POST') {
    try {
      const data = req.body;

      // WhatsApp webhook
      if (data.object === 'whatsapp_business_account') {
        const messages = data.entry?.[0]?.changes?.[0]?.value?.messages || [];
        messages.forEach((msg: any) => {
          console.log('WhatsApp:', msg.from, msg.text?.body);
        });
      }

      // Instagram webhook
      if (data.object === 'instagram') {
        const messaging = data.entry?.[0]?.messaging || [];
        messaging.forEach((msg: any) => {
          console.log('Instagram:', msg.sender.id, msg.message?.text);
        });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
