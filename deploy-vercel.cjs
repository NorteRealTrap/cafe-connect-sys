#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando deploy para Vercel...\n');

// Verificar se vercel.json existe
if (!fs.existsSync('vercel.json')) {
  console.error('❌ Arquivo vercel.json não encontrado!');
  process.exit(1);
}

// Verificar se package.json existe
if (!fs.existsSync('package.json')) {
  console.error('❌ Arquivo package.json não encontrado!');
  process.exit(1);
}

try {
  console.log('📦 Instalando dependências...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('🔍 Verificando lint...');
  try {
    execSync('npm run lint', { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️  Avisos de lint encontrados, continuando...');
  }

  console.log('🏗️  Testando build local...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('✅ Build local bem-sucedido!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Commit suas mudanças: git add . && git commit -m "fix: configuração Vercel"');
  console.log('2. Push para o repositório: git push origin main');
  console.log('3. Ou deploy direto: npx vercel --prod');
  console.log('\n🔧 Variáveis de ambiente necessárias na Vercel:');
  console.log('- JWT_SECRET');
  console.log('- WHATSAPP_PHONE_NUMBER_ID');
  console.log('- WHATSAPP_ACCESS_TOKEN');
  console.log('- WEBHOOK_VERIFY_TOKEN');
  console.log('- INSTAGRAM_PAGE_ID');
  console.log('- INSTAGRAM_ACCESS_TOKEN');
  console.log('- DATABASE_URL');
  console.log('- ALLOWED_ORIGINS');

} catch (error) {
  console.error('❌ Erro durante o processo:', error.message);
  process.exit(1);
}