# Script de Configuração do Git
# Execute este script APÓS instalar o Git

Write-Host "=== Configurando Git ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Git está instalado
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Git encontrado: $gitVersion" -ForegroundColor Green
    } else {
        throw "Git não encontrado"
    }
} catch {
    Write-Host "✗ Git não está instalado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instale o Git primeiro:" -ForegroundColor Yellow
    Write-Host "1. Acesse: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Baixe e instale o Git" -ForegroundColor White
    Write-Host "3. Reinicie o PowerShell" -ForegroundColor White
    Write-Host "4. Execute este script novamente" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "Configurando usuário Git..." -ForegroundColor Cyan

# Configurar nome de usuário
git config --global user.name "GabrielSp14"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Nome de usuário configurado: GabrielSp14" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao configurar nome de usuário" -ForegroundColor Red
}

# Configurar email
git config --global user.email "gbiel.sp@gmail.com"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Email configurado: gbiel.sp@gmail.com" -ForegroundColor Green
} else {
    Write-Host "✗ Erro ao configurar email" -ForegroundColor Red
}

Write-Host ""
Write-Host "Verificando configurações..." -ForegroundColor Cyan
$userName = git config --global user.name
$userEmail = git config --global user.email

Write-Host ""
Write-Host "Configurações atuais:" -ForegroundColor Yellow
Write-Host "  Nome: $userName" -ForegroundColor White
Write-Host "  Email: $userEmail" -ForegroundColor White

Write-Host ""
Write-Host "=== Configuração concluída! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Inicializar repositório: git init" -ForegroundColor White
Write-Host "2. Adicionar remote: git remote add origin https://github.com/NorteRealTrap/cafe-connect-sys.git" -ForegroundColor White
Write-Host "3. Ou clonar repositório: git clone https://github.com/NorteRealTrap/cafe-connect-sys.git" -ForegroundColor White






