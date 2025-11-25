# 🚀 Setup Rápido - Café Connect

## 1. Instalar Dependências
```bash
npm install
```

## 2. Configurar Neon Database

1. Acesse https://neon.tech e crie uma conta
2. Crie um novo projeto: **cafe-connect-db**
3. Copie a connection string
4. Atualize `.env.local`:

```env
DATABASE_URL="sua-connection-string-aqui"
DIRECT_URL="sua-connection-string-aqui"
NEXTAUTH_SECRET="gere-com-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

## 3. Setup Database
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

## 4. Rodar Localmente
```bash
npm run dev
```

Acesse: http://localhost:3000

## 5. Credenciais Padrão
- Email: `admin@cafeconnect.com`
- Senha: `admin123`

## 6. Deploy Vercel
```bash
vercel --prod
```

Configure as mesmas variáveis de ambiente na Vercel.

## Comandos Úteis
- `npm run db:studio` - Abrir Prisma Studio
- `npm run db:push` - Atualizar schema
- `npm run db:seed` - Popular dados
