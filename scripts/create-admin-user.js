import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

config({ path: '.env.development.local' });

const sql = neon(process.env.NEON_DB_DATABASE_URL);

// Hash seguro usando SHA-256 com salt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

async function createAdminUser() {
  try {
    // Criar tabela se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    const email = 'admin@cafeconnect.com';
    const password = 'admintester12345';
    const role = 'admin';
    const passwordHash = hashPassword(password);
    
    // Inserir ou atualizar usuário admin
    await sql`
      INSERT INTO users (email, password_hash, role)
      VALUES (${email}, ${passwordHash}, ${role})
      ON CONFLICT (email) 
      DO UPDATE SET password_hash = ${passwordHash}, role = ${role}
    `;
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password: [HIDDEN]');
    console.log('Role:', role);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminUser();
