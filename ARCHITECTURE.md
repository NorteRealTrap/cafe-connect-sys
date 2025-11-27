# 🏗️ Arquitetura do Sistema

## Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Railway)
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS + shadcn/ui
- **Language:** TypeScript
- **Deploy:** Railway

## Estrutura de Pastas

```
src/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── products/       # Products CRUD
│   │   ├── orders/         # Orders CRUD
│   │   └── health/         # Health check
│   ├── dashboard/          # Dashboard protegido
│   ├── login/              # Página de login
│   ├── layout.tsx          # Layout raiz
│   ├── page.tsx            # Homepage
│   └── globals.css         # Estilos globais
├── components/             # Componentes React
│   ├── auth/              # Autenticação
│   ├── ui/                # UI components (shadcn)
│   └── providers/         # Context providers
├── lib/                    # Bibliotecas
│   ├── prisma.ts          # Prisma client
│   ├── auth.ts            # NextAuth config
│   └── utils.ts           # Utilitários
├── hooks/                  # Custom hooks
├── types/                  # TypeScript types
└── middleware.ts           # Next.js middleware
```

## Fluxo de Dados

```
Cliente → Next.js App Router → API Routes → Prisma → PostgreSQL
                ↓
         NextAuth.js (Auth)
                ↓
         Middleware (Proteção)
```

## Configurações

### Railway
- Build: `npm install && npx prisma generate && npm run build`
- Start: `npm start`
- Health: `/api/health`

### Next.js
- Server Components por padrão
- API Routes em `/app/api`
- Middleware para proteção de rotas

### Prisma
- Schema: `prisma/schema.prisma`
- Client: Auto-gerado
- Migrations: `prisma db push`

## Segurança

- NextAuth.js para autenticação
- Middleware para rotas protegidas
- Bcrypt para senhas
- Prisma para SQL injection protection
- CORS configurado
- Rate limiting

## Deploy

1. Push para GitHub
2. Railway detecta e faz build
3. Executa migrations
4. Health check valida deploy
