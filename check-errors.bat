@echo off
echo 🔍 Verificando erros no projeto...
echo.

echo 1️⃣ Verificando TypeScript...
call npx tsc --noEmit
echo.

echo 2️⃣ Verificando ESLint...
call npm run lint
echo.

echo 3️⃣ Verificando variáveis de ambiente...
if not exist .env (
  echo ❌ Arquivo .env não encontrado!
) else (
  echo ✅ Arquivo .env encontrado
)
echo.

echo 4️⃣ Testando build...
call npm run build
echo.

echo ✅ Verificação completa!
pause
