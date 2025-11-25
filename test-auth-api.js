import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

config({ path: '.env.development.local' });

const sql = neon(process.env.NEON_DB_DATABASE_URL);

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
  return hash === verifyHash;
}

async function testAuth() {
  const email = 'admin@cafeconnect.com';
  const password = 'admintester12345';
  
  const users = await sql`
    SELECT id, email, password_hash, role 
    FROM users 
    WHERE email = ${email.toLowerCase()}
  `;
  
  console.log('User found:', users.length > 0);
  
  if (users.length > 0) {
    const user = users[0];
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Password valid:', verifyPassword(password, user.password_hash));
  }
}

testAuth();
