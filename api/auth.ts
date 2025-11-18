import { VercelRequest, VercelResponse } from '@vercel/node';

const hashPassword = (password: string): string => {
  return btoa(password + 'pdv-salt-2024');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email e senha obrigatórios' });
    }

    // Usuários padrão
    const users = [
      { id: '1', name: 'Administrador', email: 'admin@cafeconnect.com', password_hash: hashPassword('admin123'), role: 'admin', status: 'ativo' },
      { id: '2', name: 'Gabriel Pereira', email: 'gabriel.pereira@ccpservices.com.br', password_hash: hashPassword('ccpservices123'), role: 'admin', status: 'ativo' },
      { id: '3', name: 'Ferramenta Cega', email: 'ferramentacega@ccpservices.com.br', password_hash: hashPassword('ccpservices123'), role: 'admin', status: 'ativo' }
    ];

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.status === 'ativo');

    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ success: false, error: 'Email ou senha inválidos' });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return res.status(500).json({ success: false, error: 'Erro interno do servidor' });
  }
}
