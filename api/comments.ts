import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sql = neon(process.env.DATABASE_URL!);

  try {
    if (req.method === 'GET') {
      const comments = await sql`
        SELECT id, comment, created_at 
        FROM comments 
        ORDER BY created_at DESC
      `;
      return res.status(200).json({ comments });
    }

    if (req.method === 'POST') {
      const { comment } = req.body;

      if (!comment || comment.trim() === '') {
        return res.status(400).json({ error: 'Comment cannot be empty' });
      }

      const result = await sql`
        INSERT INTO comments (comment) 
        VALUES (${comment.trim()}) 
        RETURNING id, comment, created_at
      `;

      return res.status(201).json({ 
        success: true, 
        comment: result[0] 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
