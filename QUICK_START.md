# ⚡ Quick Start - Café Connect

## 🚀 Setup em 5 Minutos

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Configurar Neon Database

**Criar conta:** https://neon.tech

**Criar projeto:** `cafe-connect-db`

**Copiar connection string** e colar no `.env.local`:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="qualquer-string-aleatoria"
```

### 3️⃣ Setup Database
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 4️⃣ Rodar
```bash
npm run dev
```

### 5️⃣ Acessar
- **URL:** http://localhost:3000
- **Login:** admin@cafeconnect.com
- **Senha:** admin123

## ✅ Pronto!

Dashboard completo com:
- ✅ 10 produtos cadastrados
- ✅ Sistema de pedidos
- ✅ Gerenciamento completo

## 🔧 Comandos Úteis

```bash
# Ver dados no navegador
npx prisma studio

# Resetar banco
npm run db:reset

# Ver logs
npm run dev
```

## 📚 Documentação Completa

- `PRISMA_SETUP.md` - Setup detalhado do Prisma
- `MIGRATION.md` - Guia de migração completo
- `SETUP.md` - Setup geral do projeto

## 🆘 Problemas?

**Erro de conexão:**
- Verifique `.env.local`
- Certifique-se que o Neon está ativo

**Erro de módulo:**
```bash
npm install
```

**Banco vazio:**
```bash
npm run db:seed
```
