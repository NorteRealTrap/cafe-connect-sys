import { Handler } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL || '');

const hashPassword = (password: string): string => {
  return btoa(password + 'pdv-salt-2024');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');
    
    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Email e senha obrigatórios' }),
      };
    }

    // Criar tabela se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'ativo',
        created_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP DEFAULT NOW()
      )
    `;

    // Criar usuários padrão se não existirem
    const adminExists = await sql`SELECT id FROM users WHERE email = 'admin@cafeconnect.com'`;
    if (adminExists.length === 0) {
      await sql`
        INSERT INTO users (name, email, password_hash, role, status)
        VALUES ('Administrador', 'admin@cafeconnect.com', ${hashPassword('admin123')}, 'admin', 'ativo')
      `;
    }
    
    const gabrielExists = await sql`SELECT id FROM users WHERE email = 'gabriel.pereira@ccpservices.com.br'`;
    if (gabrielExists.length === 0) {
      await sql`
        INSERT INTO users (name, email, password_hash, role, status)
        VALUES ('Gabriel Pereira', 'gabriel.pereira@ccpservices.com.br', ${hashPassword('ccpservices123')}, 'admin', 'ativo')
      `;
    }
    
    const ferramentaExists = await sql`SELECT id FROM users WHERE email = 'ferramentacega@ccpservices.com.br'`;
    if (ferramentaExists.length === 0) {
      await sql`
        INSERT INTO users (name, email, password_hash, role, status)
        VALUES ('Ferramenta Cega', 'ferramentacega@ccpservices.com.br', ${hashPassword('ccpservices123')}, 'admin', 'ativo')
      `;
    }

    // Autenticar usuário
    const users = await sql`
      SELECT * FROM users 
      WHERE email = ${email.toLowerCase().trim()} 
      AND status = 'ativo'
    `;
    
    if (users.length === 0 || !verifyPassword(password, users[0].password_hash)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Email ou senha inválidos' }),
      };
    }

    const user = users[0];
    
    // Atualizar último login
    await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      }),
    };
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Erro interno do servidor' }),
    };
  }
};