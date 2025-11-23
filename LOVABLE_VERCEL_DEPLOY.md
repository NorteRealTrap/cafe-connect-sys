# 🚀 Deploy Lovable.dev → Vercel - GUIA COMPLETO

## ✅ CORREÇÕES APLICADAS

### 1. vercel.json Configurado para Lovable
- ✅ Rewrites para SPA (Single Page Application)
- ✅ CORS headers para API routes
- ✅ Build command otimizado
- ✅ Framework Vite configurado

### 2. package.json Otimizado
- ✅ Scripts simplificados
- ✅ Node version especificada (>=18.0.0)
- ✅ Dependências corretas

### 3. vite.config.js Simplificado
- ✅ Configuração limpa e funcional
- ✅ Alias @ configurado
- ✅ Build otimizado

## 🎯 DEPLOY PASSO A PASSO

### OPÇÃO 1: Via Vercel Dashboard (MAIS FÁCIL)

#### Passo 1: Conectar GitHub
Se ainda não conectou o Lovable ao GitHub:
1. Lovable.dev → Settings → Developers
2. Connect to GitHub
3. Copy Project to GitHub
4. Nome: `cafe-connect-sys`

#### Passo 2: Importar na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Add New → Project**
3. Importe o repositório `cafe-connect-sys`

#### Passo 3: Configurar Build
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x
```

#### Passo 4: Variáveis de Ambiente
Adicione no Vercel Dashboard:

```env
JWT_SECRET=sua-chave-jwt-super-secreta-aqui
WHATSAPP_PHONE_NUMBER_ID=seu-phone-number-id
WHATSAPP_ACCESS_TOKEN=seu-access-token
WEBHOOK_VERIFY_TOKEN=seu-verify-token
INSTAGRAM_PAGE_ID=seu-page-id
INSTAGRAM_ACCESS_TOKEN=seu-instagram-token
DATABASE_URL=sua-database-url
ALLOWED_ORIGINS=https://seu-dominio.vercel.app
```

**IMPORTANTE:** Adicione para Production, Preview e Development

#### Passo 5: Deploy
Clique em **Deploy** e aguarde!

---

### OPÇÃO 2: Via CLI Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# No diretório do projeto
cd cafe-connect-sys

# Login
vercel login

# Deploy
vercel --prod
```

---

### OPÇÃO 3: Via Git Push (AUTOMÁTICO)

```bash
# Commit mudanças
git add .
git commit -m "fix: configuração Vercel para Lovable"
git push origin main
```

A Vercel detecta automaticamente e faz deploy!

---

## 🔍 VERIFICAÇÕES PÓS-DEPLOY

### Teste estas URLs:
- ✅ `https://seu-dominio.vercel.app/` - Homepage
- ✅ `https://seu-dominio.vercel.app/dashboard` - Dashboard (refresh deve funcionar)
- ✅ `https://seu-dominio.vercel.app/orders` - Pedidos (refresh deve funcionar)
- ✅ `https://seu-dominio.vercel.app/api/orders` - API Orders
- ✅ `https://seu-dominio.vercel.app/api/auth` - API Auth

### Checklist:
- [ ] Homepage carrega
- [ ] Refresh em rotas não dá 404
- [ ] API endpoints respondem
- [ ] Login funciona
- [ ] WhatsApp integração funciona
- [ ] Instagram integração funciona

---

## 🐛 TROUBLESHOOTING

### ❌ Erro: "404 on page refresh"
**Causa:** vercel.json não está correto
**Solução:** ✅ Já corrigido! Verifique se o arquivo foi commitado

### ❌ Erro: "Build failed"
**Causa:** Dependências ou TypeScript errors
**Solução:** 
```bash
# Localmente, teste:
npm install
npm run build
```

Se funcionar localmente, funciona na Vercel!

### ❌ Erro: "API not working"
**Causa:** Variáveis de ambiente não configuradas
**Solução:** Configure TODAS as variáveis no Vercel Dashboard

### ❌ Erro: "CORS errors"
**Causa:** Headers não configurados
**Solução:** ✅ Já corrigido no vercel.json!

### ❌ Erro: "Module not found"
**Causa:** Dependências faltando
**Solução:**
```bash
npm install
git add package-lock.json
git commit -m "fix: update dependencies"
git push
```

---

## 📊 LOGS E DEBUGGING

### Ver logs de deploy:
```bash
vercel logs <deployment-url>
```

### Ver logs em tempo real:
```bash
vercel logs --follow
```

### Inspecionar deployment:
```bash
vercel inspect <deployment-url>
```

---

## 🎉 SUCESSO!

Após o deploy, você terá:
- ✅ URL pública funcionando
- ✅ Rotas SPA sem 404
- ✅ APIs funcionais
- ✅ CORS configurado
- ✅ Build automático a cada push

### Domínio Customizado (Opcional)
1. Vercel Dashboard → Settings → Domains
2. Add Domain
3. Configure DNS conforme instruções

---

## 📞 SUPORTE

- **Vercel Docs:** https://vercel.com/docs
- **Lovable Docs:** https://docs.lovable.dev
- **Logs:** `vercel logs`
- **Status:** https://vercel-status.com

---

🎯 **PRONTO PARA DEPLOY!** Todas as configurações Lovable → Vercel estão corretas!