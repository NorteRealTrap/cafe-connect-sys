#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Testando Build Localmente...\n');

// Teste 1: Verificar package.json
console.log('✓ Verificando package.json...');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log(`  - Nome: ${pkg.name}`);
console.log(`  - Vite: ${pkg.devDependencies?.vite || 'FALTANDO!'}`);
console.log(`  - React: ${pkg.dependencies?.react || 'FALTANDO!'}`);

// Teste 2: Verificar vite.config
console.log('\n✓ Verificando vite.config...');
const hasViteConfig = fs.existsSync('vite.config.js') || fs.existsSync('vite.config.ts');
console.log(`  - Arquivo existe: ${hasViteConfig ? 'SIM' : 'NÃO'}`);

// Teste 3: Verificar index.html
console.log('\n✓ Verificando index.html...');
const hasIndex = fs.existsSync('index.html');
console.log(`  - Arquivo existe: ${hasIndex ? 'SIM' : 'NÃO'}`);

// Teste 4: Verificar src/main
console.log('\n✓ Verificando src/main...');
const hasMain = fs.existsSync('src/main.tsx') || fs.existsSync('src/main.ts');
console.log(`  - Arquivo existe: ${hasMain ? 'SIM' : 'NÃO'}`);

// Teste 5: Tentar build
console.log('\n🏗️  Tentando build...');
try {
  execSync('npm install --include=dev', { stdio: 'inherit' });
  console.log('\n✓ Dependências instaladas');
  
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('\n✅ BUILD SUCESSO!');
  
  // Verificar dist
  if (fs.existsSync('dist')) {
    const files = fs.readdirSync('dist');
    console.log(`\n📦 Arquivos gerados em dist/: ${files.length} arquivos`);
    console.log(`  - ${files.slice(0, 5).join(', ')}...`);
  }
  
} catch (error) {
  console.error('\n❌ BUILD FALHOU!');
  console.error('Erro:', error.message);
  process.exit(1);
}

console.log('\n🎉 Todos os testes passaram!');
