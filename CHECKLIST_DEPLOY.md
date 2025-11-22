# ✅ Checklist Rápido - Deploy Vercel + GitHub

Use este checklist para verificar se tudo está configurado corretamente.

---

## 🎯 ETAPA 1: Conectar Repositório na Vercel

### 1.1 Acesso e Login
- [ ] Conta Vercel criada
- [ ] Login feito com GitHub
- [ ] Vercel autorizada no GitHub

### 1.2 Importar Projeto
- [ ] Projeto importado na Vercel
- [ ] Repositório correto selecionado
- [ ] Framework: **Vite** configurado
- [ ] Build Command: **`npm run build`**
- [ ] Output Directory: **`dist`**
- [ ] Install Command: **`npm install`**
- [ ] Primeiro deploy concluído com sucesso

---

## 🔐 ETAPA 2: Configurar Variáveis de Ambiente

### 2.1 Variáveis Obrigatórias
- [ ] `NODE_OPTIONS` = `--max-old-space-size=4096`
  - [ ] Marcada para Production
  - [ ] Marcada para Preview
- [ ] `NODE_ENV` = `production`
  - [ ] Marcada para Production
  - [ ] Marcada para Preview

### 2.2 Variáveis Opcionais (se usar)
- [ ] `WHATSAPP_PHONE_NUMBER_ID` (se usar WhatsApp)
- [ ] `WHATSAPP_ACCESS_TOKEN` (se usar WhatsApp)
- [ ] `WHATSAPP_WEBHOOK_TOKEN` (se usar WhatsApp)
- [ ] `INSTAGRAM_PAGE_ID` (se usar Instagram)
- [ ] `INSTAGRAM_ACCESS_TOKEN` (se usar Instagram)
- [ ] `JWT_SECRET` (se usar autenticação)
- [ ] `DATABASE_URL` (se usar banco externo)

### 2.3 Deploy Após Variáveis
- [ ] Novo deploy feito após adicionar variáveis
- [ ] Deploy concluído com sucesso

---

## 🚀 ETAPA 3: Habilitar Deploy Automático

### 3.1 Configuração Git
- [ ] Acessou Settings → Git
- [ ] Production Branch: **`main`**
- [ ] Auto-deploy: **Enabled** ✅
- [ ] Preview Deployments: **Enabled** ✅
- [ ] Repositório GitHub conectado

### 3.2 Verificação
- [ ] Repositório aparece como conectado
- [ ] URL do repositório está correta

---

## 🧪 TESTE FINAL

### 4.1 Teste de Deploy Automático
- [ ] Fez uma alteração no código
- [ ] Fez commit: `git commit -m "test deploy"`
- [ ] Fez push: `git push origin main`
- [ ] Novo deploy apareceu automaticamente na Vercel
- [ ] Deploy concluído com status "Ready" ✅
- [ ] Aplicação funciona no domínio da Vercel

---

## 📊 Status Geral

**Total de itens:** ___ / ___

**Status:**
- ✅ **Tudo configurado** - Pronto para produção!
- ⚠️ **Algumas pendências** - Revise os itens não marcados
- ❌ **Configuração incompleta** - Siga o guia `PASSO_A_PASSO_DEPLOY.md`

---

## 🔗 Links Úteis

- **Dashboard Vercel:** https://vercel.com/dashboard
- **Deployments:** https://vercel.com/[seu-projeto]/deployments
- **Settings:** https://vercel.com/[seu-projeto]/settings
- **Environment Variables:** https://vercel.com/[seu-projeto]/settings/environment-variables
- **Git Settings:** https://vercel.com/[seu-projeto]/settings/git

---

## 📝 Notas

- Todas as variáveis devem estar marcadas para **Production** e **Preview**
- Após adicionar variáveis, sempre faça um novo deploy
- O deploy automático funciona apenas na branch `main`
- Pull Requests criam preview deployments automaticamente

---

**Data da verificação:** ___/___/___
