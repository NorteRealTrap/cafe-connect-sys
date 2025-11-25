# ☕ Café Connect - Sistema de Gestão

Sistema completo de gerenciamento para cafeterias desenvolvido com Next.js 14, Prisma e Neon Database.

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env.local com sua connection string do Neon
# (veja .env.example)

# 3. Setup database
npx prisma generate
npx prisma db push
npm run db:seed

# 4. Rodar
npm run dev
```

**Acesse:** http://localhost:3000

**Login:** admin@cafeconnect.com / admin123

## 📚 Documentação

- **[QUICK_START.md](QUICK_START.md)** - Setup em 5 minutos
- **[PRISMA_SETUP.md](PRISMA_SETUP.md)** - Guia completo do Prisma
- **[MIGRATION.md](MIGRATION.md)** - Guia de migração detalhado
- **[SETUP.md](SETUP.md)** - Setup geral do projeto

## ✨ Funcionalidades

- ✅ Dashboard com estatísticas em tempo real
- ✅ Gerenciamento de produtos (CRUD completo)
- ✅ Sistema de pedidos com status
- ✅ Controle de estoque automático
- ✅ Autenticação com NextAuth
- ✅ Interface responsiva com Tailwind CSS
- ✅ 10 produtos pré-cadastrados

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **Database:** Neon PostgreSQL (Serverless)
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Deploy:** Vercel

## 📦 Estrutura do Projeto

```
cafe-connect-sys-main/
├── src/
│   ├── app/
│   │   ├── api/          # API Routes
│   │   ├── dashboard/    # Dashboard page
│   │   ├── admin/        # Admin pages
│   │   └── page.tsx      # Homepage
│   ├── lib/
│   │   └── prisma.ts     # Prisma client
│   └── types/
│       └── index.ts      # TypeScript types
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
├── .env.local            # Environment variables
└── package.json
```

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor de desenvolvimento
npm run build            # Build para produção
npm run start            # Iniciar servidor de produção

# Database
npm run db:generate      # Gerar Prisma Client
npm run db:push          # Criar/atualizar tabelas
npm run db:seed          # Popular banco com dados
npm run db:studio        # Abrir Prisma Studio
npm run db:reset         # Resetar e popular banco
```

## 🗄️ Schema do Banco

### Tabelas
- **users** - Usuários do sistema
- **products** - Produtos/itens do menu
- **orders** - Pedidos
- **order_items** - Itens dos pedidos

### Enums
- **UserRole:** ADMIN, MANAGER, BARISTA, CUSTOMER
- **OrderStatus:** PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED
- **ProductCategory:** COFFEE, TEA, PASTRY, SANDWICH, DESSERT, OTHER

## 🌱 Dados Iniciais (Seed)

O seed cria automaticamente:
- 1 usuário admin
- 10 produtos (5 cafés, 2 padaria, 1 sobremesa, 1 sanduíche, 1 chá)

## 🚀 Deploy na Vercel

1. Push para GitHub
2. Conecte o repositório na Vercel
3. Configure as variáveis de ambiente:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
4. Deploy automático!

## 🔐 Credenciais Padrão

**Admin:**
- Email: admin@cafeconnect.com
- Senha: admin123

⚠️ **IMPORTANTE:** Altere as credenciais em produção!

## 🆘 Troubleshooting

### Erro de conexão com banco
```bash
# Verifique .env.local
# Certifique-se que o Neon está ativo
```

### Banco vazio
```bash
npm run db:seed
```

### Erro de módulos
```bash
npm install
npx prisma generate
```

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Contribuidores

- Desenvolvido para Café Connect System

---

**Versão:** 1.0.0  
**Última atualização:** 2024
