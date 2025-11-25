import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

const sql = neon(process.env.DATABASE_URL || process.env.NEON_DB_DATABASE_URL!);
const JWT_SECRET = process.env.JWT_SECRET!;

const setCors = (res: VercelResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    // Verificar token
    if (action === 'verify' && req.method === 'GET') {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: 'Token não fornecido' });
      }

      try {
        jwt.verify(token as string, JWT_SECRET);
        return res.status(200).json({ valid: true });
      } catch (error) {
        return res.status(400).json({ valid: false, error: 'Token inválido ou expirado' });
      }
    }

    // Resetar senha
    if (action === 'reset' && req.method === 'POST') {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' });
      }

      let decoded: any;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (error) {
        return res.status(400).json({ error: 'Token inválido ou expirado' });
      }

      const { email } = decoded;

      // Hash da nova senha
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Atualizar senha no banco
      await sql`
        UPDATE users 
        SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP
        WHERE email = ${email}
      `;

      return res.status(200).json({ 
        success: true, 
        message: 'Senha alterada com sucesso' 
      });
    }

    // Solicitar reset (enviar email)
    if (action === 'request' && req.method === 'POST') {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
      }

      // Verificar se usuário existe
      const users = await sql`
        SELECT id, email, name FROM users WHERE email = ${email.toLowerCase()}
      `;

      if (users.length === 0) {
        // Por segurança, não revelar se o email existe
        return res.status(200).json({ 
          success: true, 
          message: 'Se o email existir, você receberá um link de reset' 
        });
      }

      const user = users[0];

      // Gerar token JWT com expiração de 1 hora
      const resetToken = jwt.sign(
        { email: user.email, userId: user.id },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // URL de reset
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

      // TODO: Enviar email com o link
      // Por enquanto, apenas retornar o link (em produção, enviar por email)
      console.log('Reset URL:', resetUrl);

      return res.status(200).json({ 
        success: true, 
        message: 'Link de reset enviado',
        resetUrl // Remover em produção
      });
    }

    return res.status(404).json({ error: 'Ação não encontrada' });

  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
