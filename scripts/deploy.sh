#!/bin/bash

echo "🚀 Deploy Forçado - Vercel"
echo "=========================="

# Deploy forçado para produção
echo "📦 Iniciando deploy..."
vercel --prod --force

# Capturar status
if [ $? -eq 0 ]; then
  echo "✅ Deploy concluído com sucesso!"
  echo "📋 Verificando logs..."
  vercel logs --since=2m
else
  echo "❌ Erro no deploy!"
  echo "📋 Logs de erro:"
  vercel logs --since=5m | grep -A 10 -B 10 -i "error"
fi
