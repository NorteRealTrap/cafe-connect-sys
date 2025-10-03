// Netlify Function para sincronizar pedidos entre dispositivos
let orders = [];

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'POST') {
      // Adicionar novo pedido
      const order = JSON.parse(event.body);
      orders.push(order);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, orderId: order.id })
      };
    }

    if (event.httpMethod === 'GET') {
      // Retornar todos os pedidos
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(orders)
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};