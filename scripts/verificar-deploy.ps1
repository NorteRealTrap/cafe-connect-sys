# Script de Verificação de Configuração de Deploy
# Executa verificações básicas antes do deploy

Write-Host "🔍 Verificando configuração de deploy..." -ForegroundColor Cyan
Write-Host ""

# Verificar se está no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: package.json não encontrado" -ForegroundColor Red
    Write-Host "   Execute este script na raiz do projeto" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ package.json encontrado" -ForegroundColor Green

# Verificar se vercel.json existe
if (Test-Path "vercel.json") {
    Write-Host "✅ vercel.json encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  vercel.json não encontrado (pode ser criado automaticamente)" -ForegroundColor Yellow
}

# Verificar scripts no package.json
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$scripts = $packageJson.scripts

if ($scripts.build) {
    Write-Host "✅ Script 'build' configurado: $($scripts.build)" -ForegroundColor Green
} else {
    Write-Host "❌ Script 'build' não encontrado no package.json" -ForegroundColor Red
}

if ($scripts.deploy) {
    Write-Host "✅ Script 'deploy' configurado: $($scripts.deploy)" -ForegroundColor Green
} else {
    Write-Host "⚠️  Script 'deploy' não encontrado" -ForegroundColor Yellow
}

# Verificar se node_modules existe
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules não encontrado" -ForegroundColor Yellow
    Write-Host "   Execute: npm install" -ForegroundColor Yellow
}

# Verificar git
$gitRemote = git remote -v 2>$null
if ($gitRemote) {
    Write-Host "✅ Git remote configurado" -ForegroundColor Green
    Write-Host "   $gitRemote" -ForegroundColor Gray
} else {
    Write-Host "⚠️  Git remote não configurado" -ForegroundColor Yellow
}

# Verificar branch atual
$currentBranch = git branch --show-current 2>$null
if ($currentBranch) {
    Write-Host "✅ Branch atual: $currentBranch" -ForegroundColor Green
    if ($currentBranch -eq "main") {
        Write-Host "   ✅ Está na branch main (correto para deploy)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Não está na branch main" -ForegroundColor Yellow
        Write-Host "      Para fazer deploy automático, use: git checkout main" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Não é um repositório git" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Configure o projeto na Vercel (ver PASSO_A_PASSO_DEPLOY.md)" -ForegroundColor White
Write-Host "   2. Adicione variáveis de ambiente na Vercel" -ForegroundColor White
Write-Host "   3. Habilite deploy automático" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentação:" -ForegroundColor Cyan
Write-Host "   - RESUMO_RAPIDO.md (resumo rápido)" -ForegroundColor White
Write-Host "   - PASSO_A_PASSO_DEPLOY.md (guia completo)" -ForegroundColor White
Write-Host "   - CHECKLIST_DEPLOY.md (checklist)" -ForegroundColor White
Write-Host ""
