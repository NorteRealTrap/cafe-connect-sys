# 🚀 Sistema Consolidado - Next.js 14 + Vercel + Neon

## ✅ Stack Definitiva

- **Framework:** Next.js 14 (App Router)
- **Database:** Neon PostgreSQL (Serverless)
- **Deploy:** Vercel
- **Auth:** NextAuth.js + JWT
- **ORM:** Prisma
- **Language:** TypeScript

## 📁 Estrutura Final

```
cafe-connect-sys-main/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth
│   │   │   ├── products/      # CRUD Produtos
│   │   │   └── orders/        # CRUD Pedidos
│   │   ├── dashboard/         # Dashboard
│   │   ├── admin/             # Admin pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # React Components
│   ├── lib/                   # Libraries
│   │   ├── prisma.ts         # Prisma client
│   │   └── auth.ts           # NextAuth config
│   └── types/                 # TypeScript types
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
├── public/                    # Static assets
├── .env.example              # Environment template
├── next.config.js            # Next.js config
├── vercel.json               # Vercel config
└── package.json              # Dependencies
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Criar `.env.local`:

```env
# Neon PostgreSQL
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# App
APP_URL="http://localhost:3000"
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Setup Database

```bash
# Gerar Prisma Client
npx prisma generate

# Criar tabelas
npx prisma db push

# Popular dados
npm run db:seed
```

### 4. Rodar Localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🚀 Deploy Vercel

### 1. Configurar Variáveis

No dashboard Vercel, adicionar:

```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-app.vercel.app
```

### 2. Deploy

```bash
vercel --prod
```

## 🔐 Credenciais

**Admin:**
- Email: admin@cafeconnect.com
- Senha: admin123

⚠️ Alterar em produção!

## 📊 Rotas

**Públicas:**
- `/` - Homepage
- `/api/auth/signin` - Login

**Protegidas:**
- `/dashboard` - Dashboard principal
- `/admin/products` - Gerenciar produtos
- `/admin/orders` - Gerenciar pedidos

**APIs:**
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `PUT /api/products/[id]` - Atualizar produto
- `DELETE /api/products/[id]` - Deletar produto
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar pedido
- `PATCH /api/orders/[id]` - Atualizar status

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Senhas hasheadas (bcrypt)
- ✅ Proteção CSRF
- ✅ SQL Injection protection (Prisma)
- ✅ Input validation (Zod)
- ✅ Rate limiting
- ✅ CORS configurado

## 📦 Comandos

```bash
# Desenvolvimento
npm run dev              # Servidor dev
npm run build            # Build produção
npm run start            # Servidor produção
npm run lint             # Lint código

# Database
npm run db:generate      # Gerar Prisma Client
npm run db:push          # Criar/atualizar tabelas
npm run db:studio        # Prisma Studio (GUI)
npm run db:seed          # Popular dados
npm run db:migrate       # Criar migration
npm run db:reset         # Resetar e popular
```

## ✅ Checklist Deploy

- [ ] Criar projeto Neon
- [ ] Copiar connection strings
- [ ] Configurar variáveis Vercel
- [ ] Executar `npx prisma db push`
- [ ] Executar `npm run db:seed`
- [ ] Deploy `vercel --prod`
- [ ] Testar login
- [ ] Testar CRUD produtos
- [ ] Testar CRUD pedidos
- [ ] Verificar logs Vercel

## 🎯 Status

**Sistema:** ✅ PRONTO PARA PRODUÇÃO

**Última atualização:** 2024
**Versão:** 1.0.0
