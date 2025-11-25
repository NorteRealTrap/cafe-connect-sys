import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { Resend } from 'resend';

const sql = neon(process.env.DATABASE_URL || process.env.NEON_DB_DATABASE_URL!);
const JWT_SECRET = process.env.JWT_SECRET!;
const resend = new Resend(process.env.RESEND_API_KEY);

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
      const resetUrl = `${process.env.APP_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

      // Enviar email
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
          to: user.email,
          subject: '🔐 Reset de Senha - Café Connect',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>☕ Café Connect</h1>
                  <p>Reset de Senha</p>
                </div>
                <div class="content">
                  <p>Olá, <strong>${user.name}</strong>!</p>
                  <p>Recebemos uma solicitação para resetar a senha da sua conta.</p>
                  <p>Clique no botão abaixo para criar uma nova senha:</p>
                  <center>
                    <a href="${resetUrl}" class="button">Resetar Senha</a>
                  </center>
                  <p><small>Ou copie e cole este link no navegador:</small><br>
                  <code>${resetUrl}</code></p>
                  <p><strong>⚠️ Este link expira em 1 hora.</strong></p>
                  <p>Se você não solicitou este reset, ignore este email.</p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Café Connect. Todos os direitos reservados.</p>
                </div>
              </div>
            </body>
            </html>
          `
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Não falhar se email não enviar
      }

      return res.status(200).json({ 
        success: true, 
        message: 'Se o email existir, você receberá um link de reset'
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
