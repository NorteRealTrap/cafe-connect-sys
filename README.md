# 🏪 Cafe Connect - Sistema Multi-Estabelecimentos

Sistema completo de PDV para gerenciar múltiplos tipos de estabelecimentos: padarias, lanchonetes, bares, adegas, confeitarias, restaurantes e bistrôs.

## 🚀 Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Railway)
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS + shadcn/ui
- **Language:** TypeScript
- **Deploy:** Railway

## 📁 Estrutura do Projeto

```
cafe-connect-sys-main/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── products/      # Products CRUD
│   │   │   ├── orders/        # Orders CRUD
│   │   │   └── health/        # Health check
│   │   ├── dashboard/         # Dashboard protegido
│   │   ├── login/             # Página de login
│   │   ├── layout.tsx         # Layout raiz
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Estilos globais
│   ├── components/            # Componentes React
│   │   ├── auth/             # Componentes de autenticação
│   │   ├── ui/               # Componentes UI (shadcn)
│   │   └── providers/        # Context providers
│   ├── lib/                   # Bibliotecas e configurações
│   │   ├── prisma.ts         # Prisma client
│   │   ├── auth.ts           # NextAuth config
│   │   └── utils.ts          # Utilitários
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Next.js middleware
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed data
├── public/                    # Assets estáticos
├── .env.example              # Template de variáveis
├── railway.json              # Railway config
├── next.config.js            # Next.js config
└── package.json              # Dependencies

```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
# Database (Railway PostgreSQL)
DATABASE_URL="postgresql://user:pass@host:port/database"
DIRECT_URL="postgresql://user:pass@host:port/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# App
NODE_ENV="development"
```

### 2. Instalação

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Criar tabelas no banco
npx prisma db push

# Popular dados iniciais
npm run db:seed
```

### 3. Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🚀 Deploy no Railway

### 1. Criar Projeto

1. Acesse [railway.app](https://railway.app)
2. Crie novo projeto
3. Adicione PostgreSQL database
4. Conecte seu repositório GitHub

### 2. Configurar Variáveis

No Railway dashboard, adicione:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
DIRECT_URL=${{Postgres.DATABASE_URL}}
NEXTAUTH_URL=https://seu-app.railway.app
NEXTAUTH_SECRET=seu-secret-aqui
NODE_ENV=production
```

### 3. Deploy

```bash
# Push para main branch
git push origin main

# Railway fará deploy automático
```

### 4. Executar Migrations

No Railway dashboard:

```bash
npx prisma db push
npm run db:seed
```

## 📦 Scripts Disponíveis

```bash
npm run dev              # Servidor de desenvolvimento
npm run build            # Build para produção
npm run start            # Servidor de produção
npm run lint             # Lint código

# Database
npm run db:generate      # Gerar Prisma Client
npm run db:push          # Criar/atualizar tabelas
npm run db:studio        # Prisma Studio (GUI)
npm run db:seed          # Popular dados
```

## 🗄️ Schema do Banco

### Tabelas Principais

- **users** - Usuários do sistema
- **establishments** - Estabelecimentos
- **products** - Produtos/cardápio
- **categories** - Categorias de produtos
- **orders** - Pedidos
- **order_items** - Itens dos pedidos
- **tables** - Mesas
- **payments** - Pagamentos

### Enums

- **UserRole:** ADMIN, MANAGER, BARISTA, CUSTOMER
- **OrderStatus:** PENDING, CONFIRMED, PREPARING, READY, COMPLETED, CANCELLED
- **ProductCategory:** COFFEE, TEA, PASTRY, SANDWICH, DESSERT, OTHER

## 🔐 Credenciais Padrão

**Admin:**
- Email: admin@multipdv.com
- Senha: admin123

⚠️ **IMPORTANTE:** Alterar em produção!

## 🏪 Tipos de Estabelecimentos

- ✅ Padarias (BAKERY)
- ✅ Lanchonetes (COFFEE_SHOP)
- ✅ Bares (BAR)
- ✅ Adegas (WINE_SHOP)
- ✅ Confeitarias (CONFECTIONERY)
- ✅ Restaurantes (RESTAURANT)
- ✅ Bistrôs (BISTRO)

## 🔒 Segurança

- ✅ Autenticação JWT com NextAuth
- ✅ Senhas hasheadas (bcrypt)
- ✅ Proteção CSRF
- ✅ SQL Injection protection (Prisma)
- ✅ Input validation (Zod)
- ✅ Rate limiting
- ✅ CORS configurado

## 📊 Funcionalidades

### ✅ Multi-Estabelecimentos
- Suporte para 10+ tipos de estabelecimentos
- Gestão centralizada de múltiplas unidades
- Configurações específicas por estabelecimento

### ✅ Pedidos Completos
- Pedidos locais (presencial)
- Pedidos web (online)
- Delivery
- Takeaway

### ✅ Controle de Estoque
- Movimentação automática
- Alertas de estoque baixo
- Histórico de movimentações
- Ajustes manuais com auditoria

### ✅ Sistema de Impressão
- Cupons térmicos
- Impressão para cozinha/bar
- Comprovantes fiscais
- Múltiplas impressoras

### ✅ Gestão Completa
- Usuários com diferentes permissões
- Relatórios e analytics
- Controle de mesas
- Múltiplas formas de pagamento

## 🆘 Troubleshooting

### Erro de conexão com banco

```bash
# Verificar variáveis de ambiente
echo $DATABASE_URL

# Testar conexão
npx prisma db pull
```

### Erro no build

```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build
```

### Prisma não encontrado

```bash
npx prisma generate
```

## 📄 Licença

Sistema proprietário - Todos os direitos reservados.

## 👥 Suporte

Para dúvidas e suporte:
1. Verifique a documentação
2. Consulte os logs: `npm run logs`
3. Execute health check: `/api/health`

---

**Versão:** 2.0.0  
**Última atualização:** 2024
