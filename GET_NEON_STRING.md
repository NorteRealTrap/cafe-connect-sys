# 🔗 Como Obter Connection String da Extensão Neon

## Opção 1: Via Extensão VS Code

1. Abra a extensão Neon no VS Code
2. Clique no projeto conectado
3. Copie a "Connection String"
4. Cole no `.env.local`:

```env
DATABASE_URL="cole-aqui"
DIRECT_URL="cole-aqui"
```

## Opção 2: Via Dashboard Neon

1. Acesse https://console.neon.tech
2. Selecione seu projeto
3. Vá em "Connection Details"
4. Copie a connection string
5. Cole no `.env.local`

## Opção 3: Criar .env Automaticamente

Se a extensão criou um arquivo `.env`, copie para `.env.local`:

```bash
copy .env .env.local
```

## Depois Execute

```bash
npx prisma db push
npm run db:seed
npm run dev
```

## Formato Esperado

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

**Ambas as variáveis devem ter a MESMA connection string!**
