import { neon } from '@neondatabase/serverless';

// Configuração do banco de dados
const sql = neon(process.env.DATABASE_URL || '');

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'caixa' | 'atendente';
  status: 'ativo' | 'inativo';
  created_at: string;
  last_login: string;
}

// Função para hash de senha simples (em produção use bcrypt)
export const hashPassword = (password: string): string => {
  return btoa(password + 'pdv-salt-2024');
};

export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Criar tabela de usuários
export const createUsersTable = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'caixa', 'atendente')),
        status VARCHAR(50) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
        created_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('Tabela users criada com sucesso');
  } catch (error) {
    console.error('Erro ao criar tabela users:', error);
  }
};

// Criar usuário admin padrão
export const createDefaultAdmin = async () => {
  try {
    const adminExists = await sql`
      SELECT id FROM users WHERE email = 'admin@cafeconnect.com'
    `;
    
    if (adminExists.length === 0) {
      await sql`
        INSERT INTO users (name, email, password_hash, role, status)
        VALUES ('Administrador', 'admin@cafeconnect.com', ${hashPassword('admin123')}, 'admin', 'ativo')
      `;
      console.log('Admin padrão criado');
    }
  } catch (error) {
    console.error('Erro ao criar admin padrão:', error);
  }
};

// Autenticar usuário
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const users = await sql`
      SELECT * FROM users 
      WHERE email = ${email.toLowerCase().trim()} 
      AND status = 'ativo'
    `;
    
    if (users.length === 0) return null;
    
    const user = users[0] as User;
    
    if (!verifyPassword(password, user.password_hash)) {
      return null;
    }
    
    // Atualizar último login
    await sql`
      UPDATE users 
      SET last_login = NOW() 
      WHERE id = ${user.id}
    `;
    
    return user;
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return null;
  }
};

// Listar usuários
export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await sql`
      SELECT id, name, email, role, status, created_at, last_login
      FROM users 
      ORDER BY created_at DESC
    `;
    return users as User[];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};

// Criar novo usuário
export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'caixa' | 'atendente';
}): Promise<boolean> => {
  try {
    await sql`
      INSERT INTO users (name, email, password_hash, role, status)
      VALUES (${userData.name}, ${userData.email.toLowerCase()}, ${hashPassword(userData.password)}, ${userData.role}, 'ativo')
    `;
    return true;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return false;
  }
};

// Atualizar status do usuário
export const updateUserStatus = async (userId: string, status: 'ativo' | 'inativo'): Promise<boolean> => {
  try {
    await sql`
      UPDATE users 
      SET status = ${status}
      WHERE id = ${userId}
    `;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return false;
  }
};

// Deletar usuário
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await sql`
      DELETE FROM users 
      WHERE id = ${userId}
    `;
    return true;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return false;
  }
};

// Inicializar banco de dados
export const initializeDatabase = async () => {
  await createUsersTable();
  await createDefaultAdmin();
};