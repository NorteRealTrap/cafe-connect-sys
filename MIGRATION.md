# Migração para Next.js 14 + Neon + Vercel

## ✅ Arquivos Criados

### Configuração
- `next.config.js` - Configuração Next.js
- `prisma/schema.prisma` - Schema do banco de dados
- `lib/prisma.ts` - Cliente Prisma singleton
- `.env.local` - Variáveis de ambiente

### API Routes (Serverless)
- `app/api/auth/route.ts` - Autenticação JWT + bcrypt
- `app/api/products/route.ts` - CRUD de produtos
- `app/api/orders/route.ts` - CRUD de pedidos com transações

### Frontend
- `app/layout.tsx` - Layout raiz
- `app/page.tsx` - Página de login
- `app/globals.css` - Estilos globais

### Database
- `prisma/seed.ts` - Dados iniciais

## 🚀 Próximos Passos

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Neon Database
1. Acesse https://neon.tech
2. Crie um novo projeto
3. Copie a connection string
4. Atualize `.env.local`:
```env
DATABASE_URL="sua-connection-string"
DIRECT_URL="sua-connection-string"
```

### 3. Configurar Database
```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas no Neon
npx prisma db push

# Popular dados iniciais
npm run db:seed
```

### 4. Rodar Localmente
```bash
npm run dev
```
Acesse: http://localhost:3000

### 5. Deploy na Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente na Vercel:
# - DATABASE_URL
# - DIRECT_URL
# - JWT_SECRET
# - NEXTAUTH_SECRET
```

## 📊 Schema do Banco

### Tabelas Criadas
- `users` - Usuários do sistema
- `products` - Produtos/itens do menu
- `orders` - Pedidos
- `order_items` - Itens dos pedidos

### Enums
- `UserRole`: ADMIN, MANAGER, BARISTA, CUSTOMER
- `OrderStatus`: PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED
- `ProductCategory`: COFFEE, TEA, PASTRY, SANDWICH, DESSERT, OTHER

## 🔐 Credenciais Padrão

Email: `admin@cafeconnect.com`
Senha: `admintester12345`

## 📝 Diferenças Principais

### Antes (Vite + React)
- Client-side routing (React Router)
- API em `/api` (Vercel Functions)
- LocalStorage para dados
- Vite dev server

### Depois (Next.js 14)
- Server-side rendering + App Router
- API Routes nativos do Next.js
- Neon PostgreSQL (serverless)
- Next.js dev server
- Prisma ORM
- Transações atômicas

## 🎯 Recursos Implementados

✅ Autenticação JWT + bcrypt
✅ CRUD de produtos
✅ CRUD de pedidos com transações
✅ Controle de estoque automático
✅ Schema completo com índices
✅ Seed data inicial
✅ TypeScript completo
✅ Tailwind CSS
✅ Deploy-ready para Vercel

## 📦 Estrutura de Pastas

```
cafe-connect-sys-main/
├── app/
│   ├── api/
│   │   ├── auth/route.ts
│   │   ├── products/route.ts
│   │   └── orders/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   └── prisma.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── next.config.js
├── .env.local
└── package.json
```

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Prisma Studio (GUI do banco)
npm run db:studio

# Atualizar schema
npm run db:push

# Seed data
npm run db:seed
```
