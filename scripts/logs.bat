@echo off
echo 📋 Logs Vercel
echo ==============

if "%1"=="" (
  echo Logs dos últimos 5 minutos:
  vercel logs --since=5m
) else if "%1"=="follow" (
  echo Logs em tempo real:
  vercel logs --follow
) else if "%1"=="error" (
  echo Filtrando erros:
  vercel logs --since=10m | findstr /i "error fail warning"
) else if "%1"=="build" (
  echo Logs de build:
  vercel logs --build
) else (
  echo Uso: logs.bat [follow^|error^|build]
)
