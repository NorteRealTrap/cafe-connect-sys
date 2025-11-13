# Configuração Vercel - Deploy Automático

## 🚀 Setup Inicial

### 1. Conectar Repositório GitHub à Vercel

1. Acesse https://vercel.com
2. Clique em "Add New Project"
3. Selecione o repositório: `cafe-connect-sys-main`
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Configurar Variáveis de Ambiente

No painel da Vercel, vá em **Settings → Environment Variables**:

```
NODE_OPTIONS=--max-old-space-size=4096
NODE_ENV=production
WHATSAPP_PHONE_NUMBER_ID=seu_valor
WHATSAPP_ACCESS_TOKEN=seu_valor
WEBHOOK_VERIFY_TOKEN=seu_valor
INSTAGRAM_PAGE_ID=seu_valor
INSTAGRAM_ACCESS_TOKEN=seu_valor
DATABASE_URL=seu_valor
```

### 3. Habilitar Deploy Automático

Em **Settings → Git**:
- ✅ Production Branch: `main`
- ✅ Auto-deploy: Enabled
- ✅ Preview Deployments: Enabled

## ✅ Deploy Automático Configurado

Agora todo push para `main` fará deploy automático:

```bash
git add .
git commit -m "update"
git push origin main
```

A Vercel detectará automaticamente e fará o deploy.

## 📋 Verificar Status

- Dashboard: https://vercel.com/dashboard
- Logs: https://vercel.com/[seu-projeto]/deployments

## 🔧 Deploy Manual (se necessário)

```bash
npm run deploy
```

## ⚠️ Importante

- Remova GitHub Actions workflows (já removido)
- Vercel gerencia deploys automaticamente
- Não precisa configurar secrets no GitHub
