let orderStatuses = [];
const rateLimits = new Map();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'];

function setCORSHeaders(res, origin) {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Sanitizar dados de entrada
function sanitizeStatusData(data) {
  return {
    orderId: String(data.orderId || '').substring(0, 100),
    status: String(data.status || '').substring(0, 50),
    timestamp: data.timestamp || new Date().toISOString(),
    orderNumber: String(data.orderNumber || '').substring(0, 50),
    customerPhone: String(data.customerPhone || '').substring(0, 20),
    customerKey: String(data.customerKey || '').substring(0, 100),
    customerName: String(data.customerName || '').substring(0, 200)
  };
}

function rateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 100;
  
  const requests = (rateLimits.get(ip) || []).filter(t => t > now - windowMs);
  
  if (requests.length >= maxRequests) {
    return false;
  }
  
  requests.push(now);
  rateLimits.set(ip, requests);
  return true;
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  setCORSHeaders(res, origin);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (!rateLimit(ip)) {
    return res.status(429).json({ success: false, error: 'Too many requests' });
  }

  try {
    if (req.method === 'POST') {
      // Validar entrada
      if (!req.body || !req.body.orderId) {
        return res.status(400).json({ success: false, error: 'Dados inválidos' });
      }

      // Sanitizar dados de entrada
      const statusData = sanitizeStatusData(req.body);
      
      // Atualizar ou adicionar status
      const existingIndex = orderStatuses.findIndex(s => 
        s.orderId === statusData.orderId || s.customerKey === statusData.customerKey
      );
      
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

    return res.status(405).json({ success: false, error: 'Method not allowed' });

  } catch (error) {
    console.error('API error:', error.message);
    return res.status(500).json({ success: false, error: 'Internal error' });
  }
}