# 🚀 Setup Completo do Prisma - Passo a Passo

## ✅ Arquivos Já Criados

- ✅ `prisma/schema.prisma` - Schema do banco de dados
- ✅ `prisma/seed.ts` - Dados iniciais (10 produtos + admin)
- ✅ `src/lib/prisma.ts` - Cliente Prisma
- ✅ `.env.local` - Template de variáveis de ambiente

## 📋 PASSO 1: Configurar Neon Database

### 1.1 Criar Conta no Neon
1. Acesse: https://neon.tech
2. Crie uma conta (GitHub login recomendado)
3. Clique em "Create Project"

### 1.2 Configurar Projeto
- **Project Name**: `cafe-connect-db`
- **Region**: `US East (Ohio)` ou mais próximo
- **PostgreSQL Version**: 16 (padrão)

### 1.3 Copiar Connection String
Após criar o projeto, você verá a connection string:
```
postgresql://user:password@ep-xxx-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## 📋 PASSO 2: Configurar Variáveis de Ambiente

Edite o arquivo `.env.local`:

```env
# Neon Database
DATABASE_URL="postgresql://user:password@ep-xxx-123.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-xxx-123.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Auth
JWT_SECRET="6ca5301b2a9de527237b79a74e74907466e4fc31c22e40bde6b4c74d50a7d615"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-com-openssl-rand-base64-32"
```

**Importante**: Cole a MESMA connection string em `DATABASE_URL` e `DIRECT_URL`

## 📋 PASSO 3: Instalar Dependências

```bash
npm install
```

Isso instalará:
- `@prisma/client` - Cliente Prisma
- `prisma` - CLI do Prisma
- `bcryptjs` - Hash de senhas
- `next` - Framework Next.js
- E todas as outras dependências

## 📋 PASSO 4: Gerar Prisma Client

```bash
npx prisma generate
```

Isso cria o cliente TypeScript baseado no schema.

## 📋 PASSO 5: Criar Tabelas no Banco

```bash
npx prisma db push
```

Isso cria todas as tabelas no Neon:
- ✅ users
- ✅ products
- ✅ orders
- ✅ order_items

## 📋 PASSO 6: Popular Banco com Dados Iniciais

```bash
npm run db:seed
```

Isso cria:
- ✅ 1 usuário admin (admin@cafeconnect.com / admin123)
- ✅ 10 produtos (cafés, doces, sanduíches, chás)

## 📋 PASSO 7: Verificar Dados (Opcional)

```bash
npx prisma studio
```

Abre interface visual para ver os dados no navegador.

## 📋 PASSO 8: Rodar Aplicação

```bash
npm run dev
```

Acesse: http://localhost:3000

## 🎯 Credenciais de Acesso

**Admin:**
- Email: `admin@cafeconnect.com`
- Senha: `admin123`

## 📊 Dados Criados pelo Seed

### Produtos (10 itens):

**Cafés:**
- Espresso - R$ 4,50
- Cappuccino - R$ 6,00
- Latte - R$ 5,50
- Americano - R$ 4,00
- Mocha - R$ 7,00

**Padaria:**
- Croissant - R$ 5,50
- Pão de Queijo - R$ 3,50

**Sobremesas:**
- Bolo de Cenoura - R$ 6,50

**Sanduíches:**
- Sanduíche Natural - R$ 8,00

**Chás:**
- Chá Verde - R$ 4,00

## 🔧 Comandos Úteis

```bash
# Ver dados no navegador
npx prisma studio

# Resetar banco (CUIDADO: apaga tudo)
npx prisma db push --force-reset

# Recriar dados
npm run db:seed

# Ver logs do Prisma
npx prisma db push --help

# Atualizar schema
npx prisma generate && npx prisma db push
```

## ❌ Troubleshooting

### Erro: "Can't reach database server"
- Verifique se a connection string está correta no `.env.local`
- Verifique se o projeto Neon está ativo

### Erro: "Environment variable not found: DATABASE_URL"
- Certifique-se que o arquivo `.env.local` existe na raiz
- Reinicie o servidor: `Ctrl+C` e `npm run dev`

### Erro no seed: "Unique constraint failed"
- Os dados já existem. Use: `npx prisma db push --force-reset`
- Depois rode: `npm run db:seed`

## 🚀 Deploy na Vercel

1. Push para GitHub:
```bash
git add .
git commit -m "feat: prisma setup complete"
git push origin main
```

2. Configure variáveis na Vercel:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`

3. Deploy automático!

## ✅ Checklist Final

- [ ] Neon database criado
- [ ] `.env.local` configurado
- [ ] `npm install` executado
- [ ] `npx prisma generate` executado
- [ ] `npx prisma db push` executado
- [ ] `npm run db:seed` executado
- [ ] `npm run dev` funcionando
- [ ] Login com admin@cafeconnect.com funciona
- [ ] Dashboard mostra produtos

**Tudo pronto! 🎉**
