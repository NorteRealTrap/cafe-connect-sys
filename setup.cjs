#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Configurando Cafe Connect System...\n');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Criando arquivo .env...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env criado a partir de .env.example\n');
  } else {
    console.log('⚠️  .env.example não encontrado, criando .env básico...\n');
    
    const basicEnv = `# Configurações de Armazenamento Seguro
REACT_APP_STORAGE_KEY=ccpservices_orders_v1
REACT_APP_STATUS_STORAGE_KEY=ccpservices_status_v1
REACT_APP_TABLES_STORAGE_KEY=ccpservices_tables_v1

# Senha Padrão para Desenvolvimento (ALTERAR EM PRODUÇÃO)
VITE_DEFAULT_PASSWORD=Admin@2024!

# Configurações JWT
JWT_SECRET=${crypto.randomBytes(32).toString('hex')}

# Configurações de API
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
`;
    
    fs.writeFileSync(envPath, basicEnv);
    console.log('✅ Arquivo .env criado com configurações básicas\n');
  }
} else {
  console.log('ℹ️  Arquivo .env já existe\n');
}

let envContent = fs.readFileSync(envPath, 'utf8');

if (!envContent.includes('JWT_SECRET=') || envContent.includes('JWT_SECRET=your_')) {
  console.log('🔐 Gerando JWT_SECRET seguro...');
  const jwtSecret = crypto.randomBytes(32).toString('hex');
  
  if (envContent.includes('JWT_SECRET=')) {
    envContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${jwtSecret}`);
  } else {
    envContent += `\n# Configurações JWT\nJWT_SECRET=${jwtSecret}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ JWT_SECRET gerado e salvo\n');
}

console.log('📋 Checklist de Segurança:');
console.log('  [ ] Altere VITE_DEFAULT_PASSWORD no arquivo .env');
console.log('  [ ] Configure ALLOWED_ORIGINS com seus domínios');
console.log('  [ ] Revise SECURITY.md para mais informações');
console.log('  [ ] Nunca commite o arquivo .env\n');

console.log('✨ Setup concluído! Execute "npm install" e depois "npm run dev"\n');
