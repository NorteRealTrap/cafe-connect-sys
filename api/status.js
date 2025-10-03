// API para sincronizar status de pedidos em tempo real
let orderStatuses = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Atualizar status do pedido
      const { orderId, status, timestamp, orderNumber, customerPhone } = req.body;
      
      const statusData = { 
        orderId, 
        status, 
        timestamp, 
        orderNumber, 
        customerPhone 
      };
      
      const existingIndex = orderStatuses.findIndex(s => s.orderId === orderId);
      if (existingIndex >= 0) {
        orderStatuses[existingIndex] = statusData;
      } else {
        orderStatuses.push(statusData);
      }
      
      // Manter apenas os últimos 100 status para performance
      if (orderStatuses.length > 100) {
        orderStatuses = orderStatuses.slice(-100);
      }
      
      return res.status(200).json({ success: true });
    }

    if (req.method === 'GET') {
      // Retornar todos os status
      return res.status(200).json(orderStatuses);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}