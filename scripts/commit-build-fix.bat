@echo off
echo ========================================
echo Commit das Correcoes de Build
echo ========================================
echo.

echo [1/3] Adicionando arquivos ao Git...
git add .

echo.
echo [2/3] Criando commit...
git commit -m "fix: corrigir client/server components e configurar build para Vercel

- Adicionar 'use client' no componente sonner.tsx
- Criar theme-provider.tsx com configuracao correta
- Limpar cache do Next.js
- Verificar e gerar Prisma Client
- Testar build local com sucesso

Build testado e funcionando:
- 11 paginas geradas
- Todas as rotas de API funcionais
- Middleware configurado
- Otimizacoes aplicadas"

echo.
echo [3/3] Enviando para o repositorio remoto...
git push origin main

echo.
echo ========================================
echo Commit concluido com sucesso!
echo ========================================
echo.
echo Proximos passos:
echo 1. Verificar deploy na Vercel
echo 2. Configurar banco de dados com: npx prisma db push
echo 3. Popular dados com: npx prisma db seed
echo.
pause
