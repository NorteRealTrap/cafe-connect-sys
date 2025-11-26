# 🚂 Deploy na Railway - Guia Completo

## ✅ Preparação Concluída

Todas as configurações da Vercel foram removidas e o projeto está pronto para Railway!

### Arquivos Removidos
- ✅ `vercel.json` - Removido
- ✅ `.vercelignore` - Removido
- ✅ `.vercel/` - Diretório removido

### Arquivos Criados para Railway
- ✅ `railway.json` - Configuração Railway
- ✅ `nixpacks.toml` - Build configuration
- ✅ `Procfile` - Start command
- ✅ `package.json` - Atualizado com `prisma migrate deploy`

---

## 🚀 Passo a Passo - Deploy Railway

### 1️⃣ Criar Conta na Railway
1. Acesse: https://railway.app
2. Clique em "Start a New Project"
3. Faça login com GitHub

### 2️⃣ Criar Banco de Dados PostgreSQL
1. No dashboard Railway, clique em "+ New"
2. Selecione "Database" → "PostgreSQL"
3. Aguarde a criação (30 segundos)
4. Copie a `DATABASE_URL` que aparece nas variáveis

### 3️⃣ Criar Projeto Next.js
1. Clique em "+ New" novamente
2. Selecione "Deploy from GitHub repo"
3. Conecte seu repositório: `NorteRealTrap/cafe-connect-sys`
4. Clique em "Deploy Now"

### 4️⃣ Configurar Variáveis de Ambiente

No projeto Next.js, vá em "Variables" e adicione:

```bash
# Database
DATABASE_URL=postgresql://postgres:senha@host:5432/railway
DIRECT_URL=postgresql://postgres:senha@host:5432/railway

# NextAuth
NEXTAUTH_URL=https://seu-projeto.up.railway.app
NEXTAUTH_SECRET=l6gazleLdEZ2SVBAi+0d4aqnCd+GHbR9XdO2RCrB4sw=

# JWT (opcional)
JWT_SECRET=l6gazleLdEZ2SVBAi+0d4aqnCd+GHbR9XdO2RCrB4sw=

# Node
NODE_ENV=production
```

**Importante:** Use a `DATABASE_URL` do PostgreSQL que você criou no passo 2!

### 5️⃣ Conectar Banco ao Projeto

1. No dashboard, clique no serviço PostgreSQL
2. Vá em "Connect" → "Connect to this service"
3. Selecione seu projeto Next.js
4. Isso vai adicionar automaticamente a `DATABASE_URL`

### 6️⃣ Fazer Deploy

```bash
# Commit e push
git add .
git commit -m "feat: configurar projeto para Railway"
git push origin main
```

O Railway vai detectar o push e fazer deploy automático!

---

## 🔧 Configurações do Projeto

### package.json (Já Atualizado)
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

### railway.json
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

---

## 📊 Após o Deploy

### 1. Verificar Build
- Vá em "Deployments" no Railway
- Aguarde o build terminar (3-5 minutos)
- Verifique os logs em caso de erro

### 2. Executar Migrations
O comando `prisma migrate deploy` já roda automaticamente no build!

### 3. Popular Banco de Dados

Opção A - Via Railway CLI:
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Conectar ao projeto
railway link

# Executar seed
railway run npm run db:seed
```

Opção B - Via Prisma Studio:
```bash
# Conectar ao banco Railway
DATABASE_URL="sua-url-railway" npx prisma studio

# Adicionar dados manualmente
```

### 4. Testar o Sistema
- URL: https://seu-projeto.up.railway.app
- Login com credenciais do seed

---

## 🔑 Credenciais de Teste

Após executar o seed:

```
Admin:
  Email: admin@multipdv.com
  Senha: admin123

Gerente:
  Email: gerente@multipdv.com
  Senha: gerente123

Caixa:
  Email: caixa@multipdv.com
  Senha: caixa123
```

---

## 🛠️ Comandos Úteis Railway

### Instalar Railway CLI
```bash
npm install -g @railway/cli
```

### Login
```bash
railway login
```

### Conectar ao Projeto
```bash
railway link
```

### Ver Logs
```bash
railway logs
```

### Executar Comandos no Servidor
```bash
railway run npm run db:seed
railway run npx prisma studio
```

### Abrir Projeto no Browser
```bash
railway open
```

---

## 🔍 Troubleshooting

### Build Falha
1. Verifique logs no Railway dashboard
2. Certifique-se que `DATABASE_URL` está configurada
3. Verifique se o Prisma schema está correto

### Erro de Conexão com Banco
1. Verifique se o PostgreSQL está rodando
2. Confirme que os serviços estão conectados
3. Teste a conexão: `railway run npx prisma db push`

### Erro 500 no Site
1. Vá em "Observability" → "Logs"
2. Procure por erros de runtime
3. Verifique se todas as variáveis estão configuradas

### Migrations Não Aplicadas
```bash
# Via Railway CLI
railway run npx prisma migrate deploy

# Ou force push
railway run npx prisma db push --force-reset
```

---

## 📈 Vantagens da Railway

✅ **Deploy Automático** - Push no GitHub = Deploy automático
✅ **PostgreSQL Incluído** - Banco de dados gerenciado
✅ **Logs em Tempo Real** - Debugging fácil
✅ **Variáveis de Ambiente** - Interface simples
✅ **SSL Automático** - HTTPS configurado
✅ **Domínio Grátis** - *.up.railway.app
✅ **Rollback Fácil** - Voltar para versões anteriores

---

## 💰 Planos Railway

- **Free Tier**: $5 de crédito/mês (suficiente para testes)
- **Developer**: $5/mês + uso
- **Team**: $20/mês + uso

---

## 🎯 Próximos Passos

1. ✅ Configurações Vercel removidas
2. ✅ Arquivos Railway criados
3. ✅ package.json atualizado
4. ⏳ Criar conta na Railway
5. ⏳ Criar banco PostgreSQL
6. ⏳ Fazer deploy do projeto
7. ⏳ Configurar variáveis de ambiente
8. ⏳ Executar seed do banco
9. ⏳ Testar o sistema

---

## 📞 Suporte

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app

---

**Status:** ✅ PRONTO PARA RAILWAY
**Última Atualização:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
