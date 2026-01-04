# 🚀 GUIA DE PRODUÇÃO - CAFE CONNECT SYSTEM

**Status:** ✅ Pronto para Produção  
**Data:** 4 de janeiro de 2026

---

## 📋 PASSO A PASSO - PREPARAÇÃO PARA PRODUÇÃO

### 1. RAILWAY - CONFIGURAÇÃO DO BANCO DE DADOS

#### Criar PostgreSQL na Railway:
1. Acesse https://railway.app
2. Vá para seu projeto `cafeconnectservices`
3. Clique em **"+ New"** → **"Database"** → **"PostgreSQL"**
4. Aguarde a criação (~2 minutos)

#### Configurar Variáveis de Ambiente:

No dashboard do Railway, acesse **Variables** do projeto e adicione:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/cafe_connect
DIRECT_URL=postgresql://user:password@host:5432/cafe_connect

# NextAuth
NEXTAUTH_URL=https://seu-projeto.up.railway.app
NEXTAUTH_SECRET=seu-secret-aleatorio-gerado-aqui

# Node
NODE_ENV=production

# Optional
NEXTAUTH_TRUST_HOST=true
```

**Para gerar NEXTAUTH_SECRET seguro:**
```bash
openssl rand -base64 32
# Copie o resultado e cole no Railway
```

---

### 2. CONECTAR BANCO DE DADOS

#### Via Railway CLI (Recomendado):

```bash
# Fazer login
railway login --browserless

# Link com o projeto
railway link --project cafeconnectservices

# Ver variáveis automaticamente adicionadas
railway variables
```

#### Manual:

1. No PostgreSQL do Railway, clique em **"Connect"**
2. Copie a `DATABASE_URL`
3. Adicione em **Variables** como `DATABASE_URL`
4. Repita com `DIRECT_URL`

---

### 3. MIGRATIONS & SEED

Após configurar as variáveis, execute:

```bash
# Local (antes de fazer push)
npm run db:migrate

# Ou na Railway (após deploy)
railway run npm run db:migrate
railway run npm run db:seed
```

---

### 4. VERIFICAR HEALTH CHECK

Após o deploy:

```bash
# Verificar se aplicação está saudável
curl https://seu-projeto.up.railway.app/api/health

# Resposta esperada:
{
  "status": "healthy",
  "timestamp": "2026-01-04T...",
  "database": "connected"
}
```

---

## 🔑 CREDENCIAIS DE TESTE (Após Seed)

```
Admin:
- Email: admin@multipdv.com
- Senha: admin123
- Role: ADMIN (todas as permissões)

Gerente:
- Email: gerente@multipdv.com
- Senha: gerente123
- Role: MANAGER

Caixa:
- Email: caixa@multipdv.com
- Senha: caixa123
- Role: CASHIER
```

---

## 📊 ESTRUTURA DE DADOS

### Usuários (3 padrão)
- Admin (ADMIN)
- Manager (MANAGER)
- Cashier (CASHIER)

### Estabelecimentos (5 padrão)
- Restaurante
- Padaria
- Bar
- Lanchonete
- Confeitaria

### Dados por Estabelecimento:
- 10 mesas
- ~20 produtos
- 5 métodos de pagamento
- 3 configurações de impressão

---

## 🔒 SEGURANÇA EM PRODUÇÃO

### ✅ Checklist de Segurança:

- [ ] `NEXTAUTH_SECRET` definido com valor forte (32+ caracteres aleatórios)
- [ ] `DATABASE_URL` apontando para banco de produção
- [ ] `NEXTAUTH_URL` com domínio correto
- [ ] `NODE_ENV=production`
- [ ] SSL/HTTPS habilitado (Railway faz automaticamente)
- [ ] Backup automático do banco configurado
- [ ] Logs monitorados

### Senhas de Teste:
**⚠️ IMPORTANTE:** Após o primeiro acesso, altere as senhas padrão!

```typescript
// Alterar senha via dashboard
POST /api/auth/update-password
{
  "currentPassword": "admin123",
  "newPassword": "sua-nova-senha-forte"
}
```

---

## 🔧 MAINTENANCE & MONITORING

### Ver Logs em Produção:
```bash
railway logs --follow
```

### Redeployar Última Versão:
```bash
railway redeploy
```

### Status do Banco:
```bash
railway connect  # Abre psql interativo
\dt              # Lista tabelas
SELECT COUNT(*) FROM "Order"; # Conta orders
```

### Backup do Banco:
```bash
# Exportar dados
railway run "pg_dump $DATABASE_URL > backup.sql"

# Baixar arquivo
railway run "cat backup.sql" > backup_$(date +%Y%m%d).sql
```

---

## 📈 SCALING & PERFORMANCE

### Aumentar Recursos:
1. Railway Dashboard → **Plan**
2. Escolha tier superior (Pro, Business)
3. Recursos aumentam automaticamente

### Otimizações Já Implementadas:
- ✅ Next.js production build otimizado
- ✅ Prisma client gerado
- ✅ Tailwind CSS minificado
- ✅ Imagens otimizadas
- ✅ Code splitting automático

---

## 🆘 TROUBLESHOOTING

### Build Falha na Railway:

```bash
# Limpar cache local e fazer rebuild
rm -rf .next node_modules
npm install
npm run build

# Se ainda falhar, verificar logs detalhados:
railway logs --build
```

### Banco não conecta:

```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão
psql $DATABASE_URL

# Se retornar um shell psql, a conexão está ok
```

### Autenticação falha:

- [ ] Verificar se `NEXTAUTH_SECRET` está definido
- [ ] Verificar se cookies estão habilitados
- [ ] Limpar cookies do navegador
- [ ] Verificar `NEXTAUTH_URL` matches domínio real

### Tabelas não existem:

```bash
# Executar migrations
railway run npm run db:migrate

# Executar seed
railway run npm run db:seed
```

---

## 📞 SUPORTE E CONTATO

**Railway Support:** https://railway.app/support  
**Next.js Docs:** https://nextjs.org/docs  
**Prisma Docs:** https://www.prisma.io/docs  
**NextAuth Docs:** https://next-auth.js.org

---

## 🎉 SUCESSO!

Se você conseguiu seguir todos os passos e o health check retornou `"healthy"`, parabéns! 🎊

Seu Cafe Connect System está em produção e pronto para receber usuários!

**URL da Aplicação:** `https://seu-projeto.up.railway.app`

**Acesso Admin:** https://seu-projeto.up.railway.app/login

Aproveite! 🚀
