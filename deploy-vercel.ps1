# Script de Deploy para Vercel - MultiPDV
Write-Host "🚀 DEPLOY MULTIPDV NA VERCEL" -ForegroundColor Cyan

# Verificar se Vercel CLI está instalado
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "`n📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Verificar se há mudanças não commitadas
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "`n⚠️  Há mudanças não commitadas!" -ForegroundColor Yellow
    Write-Host "Deseja commitar agora? (S/N)" -ForegroundColor Yellow
    $commit = Read-Host
    
    if ($commit -eq "S" -or $commit -eq "s") {
        git add .
        $message = Read-Host "Mensagem do commit"
        git commit -m "$message"
    }
}

# Fazer push para o repositório remoto
Write-Host "`n📤 Fazendo push para o repositório..." -ForegroundColor Yellow
git push origin main

# Deploy na Vercel
Write-Host "`n🚀 Iniciando deploy na Vercel..." -ForegroundColor Green
Write-Host "Escolha o tipo de deploy:" -ForegroundColor Cyan
Write-Host "1. Preview (desenvolvimento)" -ForegroundColor White
Write-Host "2. Production (produção)" -ForegroundColor White
$deployType = Read-Host "Opção"

if ($deployType -eq "2") {
    vercel --prod
} else {
    vercel
}

Write-Host "`nDEPLOY CONCLUIDO!" -ForegroundColor Green
Write-Host "`nPROXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Configure as variáveis de ambiente no dashboard da Vercel" -ForegroundColor White
Write-Host "2. Execute o seed do banco: npm run db:seed" -ForegroundColor White
Write-Host "3. Acesse seu domínio e faça login" -ForegroundColor White
Write-Host "`nCredenciais de teste:" -ForegroundColor Cyan
Write-Host "   Admin: admin@multipdv.com / admin123" -ForegroundColor White
Write-Host "   Gerente: gerente@multipdv.com / gerente123" -ForegroundColor White
Write-Host "   Caixa: caixa@multipdv.com / caixa123" -ForegroundColor White
