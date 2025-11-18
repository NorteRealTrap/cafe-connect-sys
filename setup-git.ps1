# Script de Configuração do Git para Café Connect Sys
# Execute este script após instalar o Git

Write-Host "=== Configuração do Git para Café Connect Sys ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✓ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git não está instalado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Git primeiro. Veja INSTALACAO_GIT.md" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Escolha uma opção:" -ForegroundColor Yellow
Write-Host "1. Inicializar repositório Git neste diretório"
Write-Host "2. Clonar repositório do GitHub"
Write-Host ""
$opcao = Read-Host "Digite o número da opção (1 ou 2)"

if ($opcao -eq "1") {
    Write-Host ""
    Write-Host "Inicializando repositório Git..." -ForegroundColor Cyan
    
    # Verificar se já é um repositório Git
    if (Test-Path .git) {
        Write-Host "⚠ Este diretório já é um repositório Git!" -ForegroundColor Yellow
    } else {
        git init
        Write-Host "✓ Repositório Git inicializado" -ForegroundColor Green
    }
    
    # Adicionar remote
    Write-Host ""
    $adicionarRemote = Read-Host "Deseja adicionar o remote do GitHub? (s/n)"
    if ($adicionarRemote -eq "s" -or $adicionarRemote -eq "S") {
        git remote add origin https://github.com/NorteRealTrap/cafe-connect-sys.git
        Write-Host "✓ Remote 'origin' adicionado" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. git add ."
    Write-Host "2. git commit -m 'Initial commit'"
    Write-Host "3. git branch -M main"
    Write-Host "4. git push -u origin main"
    
} elseif ($opcao -eq "2") {
    Write-Host ""
    Write-Host "Clonando repositório do GitHub..." -ForegroundColor Cyan
    Write-Host "⚠ Isso criará uma nova pasta 'cafe-connect-sys' no diretório atual" -ForegroundColor Yellow
    $confirmar = Read-Host "Continuar? (s/n)"
    
    if ($confirmar -eq "s" -or $confirmar -eq "S") {
        git clone https://github.com/NorteRealTrap/cafe-connect-sys.git
        Write-Host "✓ Repositório clonado com sucesso!" -ForegroundColor Green
        Write-Host "Execute: cd cafe-connect-sys" -ForegroundColor Cyan
    }
} else {
    Write-Host "Opção inválida!" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Configuração concluída ===" -ForegroundColor Cyan






