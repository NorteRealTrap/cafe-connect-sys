import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import * as jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL || process.env.NEON_DB_DATABASE_URL!);
const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-super-seguro-aqui';

const setCors = (res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

function verifyToken(req: VercelRequest): any {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token não fornecido');
  }

  const token = authHeader.substring(7);
  return jwt.verify(token, JWT_SECRET);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const user = verifyToken(req);

    if (req.method === 'GET' && !req.query.id) {
      const { status, limit = '50', offset = '0' } = req.query;

      let query = `
        SELECT o.*, u.name as customer_name, u.email as customer_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
      `;

      const conditions = [];
      const params: any[] = [];

      if (status) {
        conditions.push(`o.status = $${params.length + 1}`);
        params.push(status);
      }

      if (user.role !== 'admin') {
        conditions.push(`o.user_id = $${params.length + 1}`);
        params.push(user.id);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ` ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit as string), parseInt(offset as string));

      const orders = await sql(query, params);

      return res.status(200).json({ orders });
    }

    if (req.method === 'GET' && req.query.id) {
      const orderId = req.query.id;

      const orders = await sql`
        SELECT o.*, u.name as customer_name, u.email as customer_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = ${orderId}
      `;

      if (orders.length === 0) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      const order = orders[0];

      if (user.role !== 'admin' && order.user_id !== user.id) {
        return res.status(403).json({ error: 'Sem permissão para acessar este pedido' });
      }

      const items = await sql`
        SELECT * FROM order_items WHERE order_id = ${orderId}
      `;

      return res.status(200).json({ order: { ...order, items } });
    }

    if (req.method === 'POST') {
      const { items, total, notes, delivery_address, phone } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Pedido deve ter pelo menos 1 item' });
      }

      if (!total || total <= 0) {
        return res.status(400).json({ error: 'Total inválido' });
      }

      const newOrder = await sql`
        INSERT INTO orders (user_id, total, status, notes, delivery_address, phone)
        VALUES (${user.id}, ${total}, 'pending', ${notes || null}, ${delivery_address || null}, ${phone || null})
        RETURNING *
      `;

      const orderId = newOrder[0].id;

      for (const item of items) {
        await sql`
          INSERT INTO order_items (order_id, product_name, quantity, price, subtotal)
          VALUES (
            ${orderId}, 
            ${item.product_name}, 
            ${item.quantity}, 
            ${item.price}, 
            ${item.quantity * item.price}
          )
        `;
      }

      const orderItems = await sql`
        SELECT * FROM order_items WHERE order_id = ${orderId}
      `;

      return res.status(201).json({
        success: true,
        order: { ...newOrder[0], items: orderItems }
      });
    }

    if (req.method === 'PUT' && req.query.id) {
      const orderId = req.query.id;
      const { status, notes } = req.body;

      const existing = await sql`
        SELECT * FROM orders WHERE id = ${orderId}
      `;

      if (existing.length === 0) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      if (user.role !== 'admin' && existing[0].user_id !== user.id) {
        return res.status(403).json({ error: 'Sem permissão' });
      }

      const updated = await sql`
        UPDATE orders
        SET 
          status = COALESCE(${status}, status),
          notes = COALESCE(${notes}, notes),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${orderId}
        RETURNING *
      `;

      return res.status(200).json({
        success: true,
        order: updated[0]
      });
    }

    if (req.method === 'DELETE' && req.query.id) {
      const orderId = req.query.id;

      const existing = await sql`
        SELECT * FROM orders WHERE id = ${orderId}
      `;

      if (existing.length === 0) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
      }

      if (user.role !== 'admin' && existing[0].user_id !== user.id) {
        return res.status(403).json({ error: 'Sem permissão' });
      }

      if (!['pending', 'confirmed'].includes(existing[0].status)) {
        return res.status(400).json({ 
          error: 'Não é possível cancelar pedidos em andamento ou finalizados' 
        });
      }

      await sql`
        UPDATE orders 
        SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${orderId}
      `;

      return res.status(200).json({
        success: true,
        message: 'Pedido cancelado com sucesso'
      });
    }

    return res.status(404).json({ error: 'Endpoint não encontrado' });

  } catch (error) {
    if (error instanceof Error && error.message === 'Token não fornecido') {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    console.error('Orders API error:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
