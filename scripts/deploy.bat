@echo off
echo 🚀 Deploy Forçado - Vercel
echo ==========================

echo 📦 Iniciando deploy...
vercel --prod --force

if %ERRORLEVEL% EQU 0 (
  echo ✅ Deploy concluído com sucesso!
  echo 📋 Verificando logs...
  vercel logs --since=2m
) else (
  echo ❌ Erro no deploy!
  echo 📋 Logs de erro:
  vercel logs --since=5m
)
