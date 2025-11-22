# 🚀 Início Rápido - Deploy Vercel + GitHub

## 📚 Documentação Criada

Criei 4 arquivos para te ajudar com o deploy:

### 1. ⚡ **RESUMO_RAPIDO.md** 
   - Resumo das 3 etapas em 1 página
   - **Comece por aqui se quiser algo rápido!**

### 2. 📖 **PASSO_A_PASSO_DEPLOY.md**
   - Guia completo e detalhado
   - Passo a passo com explicações
   - **Use este se precisar de detalhes**

### 3. ✅ **CHECKLIST_DEPLOY.md**
   - Checklist para verificar tudo
   - Marque cada item conforme configura
   - **Use para não esquecer nada**

### 4. 📘 **GUIA_DEPLOY_COMPLETO.md**
   - Guia completo com troubleshooting
   - Comandos úteis
   - **Referência completa**

---

## 🎯 As 3 Etapas (Resumo)

### ETAPA 1: Conectar Repositório na Vercel
1. Acesse https://vercel.com
2. Login com GitHub
3. Importe o projeto
4. Configure: Vite, Build: `npm run build`, Output: `dist`

### ETAPA 2: Configurar Variáveis de Ambiente
1. Settings → Environment Variables
2. Adicione: `NODE_OPTIONS=--max-old-space-size=4096`
3. Adicione: `NODE_ENV=production`
4. Adicione outras se necessário
5. Faça redeploy

### ETAPA 3: Habilitar Deploy Automático
1. Settings → Git
2. Production Branch: `main`
3. Auto-deploy: Enabled ✅
4. Preview Deployments: Enabled ✅

---

## 🧪 Testar

```bash
git add .
git commit -m "test deploy"
git push origin main
```

O deploy deve iniciar automaticamente na Vercel!

---

## 🔍 Verificar Configuração

Execute o script de verificação:

```powershell
# Windows PowerShell
.\scripts\verificar-deploy.ps1
```

---

## 📋 Variáveis de Ambiente Necessárias

### Obrigatórias:
- `NODE_OPTIONS=--max-old-space-size=4096`
- `NODE_ENV=production`

### Opcionais (se usar):
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_WEBHOOK_TOKEN`
- `INSTAGRAM_PAGE_ID`
- `INSTAGRAM_ACCESS_TOKEN`
- `JWT_SECRET`
- `DATABASE_URL`

---

## 🆘 Precisa de Ajuda?

1. **Comece pelo RESUMO_RAPIDO.md** para visão geral
2. **Siga o PASSO_A_PASSO_DEPLOY.md** para configuração detalhada
3. **Use o CHECKLIST_DEPLOY.md** para verificar tudo
4. **Consulte GUIA_DEPLOY_COMPLETO.md** para troubleshooting

---

## ✅ Pronto para Começar?

1. Abra **RESUMO_RAPIDO.md** ou **PASSO_A_PASSO_DEPLOY.md**
2. Siga as instruções passo a passo
3. Use o **CHECKLIST_DEPLOY.md** para não esquecer nada
4. Teste fazendo um push para `main`

**Tempo estimado:** 10-15 minutos

---

**Boa sorte com o deploy! 🚀**
