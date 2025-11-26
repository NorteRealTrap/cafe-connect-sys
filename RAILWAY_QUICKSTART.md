# 🚂 Railway - Início Rápido

## ✅ Projeto Pronto para Railway!

Todas as configurações da Vercel foram removidas e o projeto está configurado para Railway.

---

## 🚀 Deploy em 5 Passos

### 1. Criar Conta
👉 https://railway.app
- Login com GitHub

### 2. Criar PostgreSQL
- Dashboard → "+ New" → "Database" → "PostgreSQL"
- Copie a `DATABASE_URL`

### 3. Deploy do Projeto
- "+ New" → "Deploy from GitHub repo"
- Selecione: `NorteRealTrap/cafe-connect-sys`
- Clique "Deploy Now"

### 4. Configurar Variáveis
No projeto, vá em "Variables" e adicione:

```env
DATABASE_URL=<cole-a-url-do-postgres>
NEXTAUTH_URL=https://seu-projeto.up.railway.app
NEXTAUTH_SECRET=l6gazleLdEZ2SVBAi+0d4aqnCd+GHbR9XdO2RCrB4sw=
NODE_ENV=production
```

### 5. Conectar Serviços
- Clique no PostgreSQL
- "Connect" → Selecione seu projeto Next.js
- Isso adiciona a DATABASE_URL automaticamente

---

## 📊 Após Deploy

### Popular Banco de Dados

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login e conectar
railway login
railway link

# Executar seed
railway run npm run db:seed
```

### Testar Sistema
- URL: https://seu-projeto.up.railway.app
- Login: admin@multipdv.com / admin123

---

## 🎯 Checklist

- [ ] Conta Railway criada
- [ ] PostgreSQL criado
- [ ] Projeto deployado
- [ ] Variáveis configuradas
- [ ] Serviços conectados
- [ ] Seed executado
- [ ] Sistema testado

---

## 📝 Arquivos Criados

✅ `railway.json` - Config Railway
✅ `nixpacks.toml` - Build config
✅ `Procfile` - Start command
✅ `package.json` - Atualizado

## 🗑️ Arquivos Removidos

✅ `vercel.json` - Removido
✅ `.vercelignore` - Removido
✅ `.vercel/` - Removido

---

## 💡 Dica

O Railway faz deploy automático a cada push no GitHub!

```bash
git add .
git commit -m "sua mensagem"
git push origin main
```

---

**Leia o guia completo:** `RAILWAY_DEPLOY.md`
