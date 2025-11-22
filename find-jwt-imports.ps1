# find-jwt-imports.ps1
# Script para encontrar todas as importações de jsonwebtoken no código

Write-Host "🔍 Procurando importações de 'jsonwebtoken' no código..." -ForegroundColor Yellow
Write-Host ""

# Procurar em arquivos TypeScript e JavaScript
$files = Get-ChildItem -Path "src" -Include "*.ts","*.tsx","*.js","*.jsx" -Recurse

$foundImports = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Procurar por imports de jsonwebtoken
    if ($content -match "import.*['`"]jsonwebtoken['`"]" -or 
        $content -match "require\(['`"]jsonwebtoken['`"]\)" -or
        $content -match "from ['`"]jsonwebtoken['`"]") {
        
        $foundImports += $file.FullName
        
        Write-Host "❌ ENCONTRADO em:" -ForegroundColor Red
        Write-Host "   $($file.FullName)" -ForegroundColor White
        
        # Mostrar as linhas com o import
        $lines = Get-Content $file.FullName
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match "jsonwebtoken") {
                Write-Host "   Linha $($i + 1): $($lines[$i])" -ForegroundColor Gray
            }
        }
        Write-Host ""
    }
}

if ($foundImports.Count -eq 0) {
    Write-Host "✅ Nenhuma importação de 'jsonwebtoken' encontrada no código!" -ForegroundColor Green
} else {
    Write-Host "📊 RESUMO:" -ForegroundColor Yellow
    Write-Host "   Total de arquivos com imports: $($foundImports.Count)" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  AÇÃO NECESSÁRIA:" -ForegroundColor Yellow
    Write-Host "   1. Remova os imports de 'jsonwebtoken' dos arquivos acima" -ForegroundColor White
    Write-Host "   2. Use 'src/lib/auth-client.ts' ao invés de 'src/lib/jwt.ts'" -ForegroundColor White
    Write-Host "   3. Execute: npm run build" -ForegroundColor White
}

Write-Host ""
Write-Host "🔍 Procurando arquivo 'jwt.ts' ou 'jwt.js'..." -ForegroundColor Yellow
$jwtFiles = Get-ChildItem -Path "src" -Include "jwt.ts","jwt.tsx","jwt.js","jwt.jsx" -Recurse -ErrorAction SilentlyContinue

if ($jwtFiles.Count -gt 0) {
    Write-Host "❌ ARQUIVOS JWT ENCONTRADOS (devem ser deletados):" -ForegroundColor Red
    foreach ($file in $jwtFiles) {
        Write-Host "   $($file.FullName)" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "💡 Para deletar:" -ForegroundColor Yellow
    foreach ($file in $jwtFiles) {
        Write-Host "   Remove-Item `"$($file.FullName)`"" -ForegroundColor Gray
    }
} else {
    Write-Host "✅ Nenhum arquivo jwt.ts encontrado" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Verificação concluída!" -ForegroundColor Cyan
