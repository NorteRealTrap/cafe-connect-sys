# Deploy Configuration

## ⚠️ IMPORTANTE: Deploy Automático via Vercel

O projeto está configurado para deploy automático via Vercel.
Todo push para `main` faz deploy automaticamente.

Veja `VERCEL_SETUP.md` para configuração inicial.

## 🚀 Deploy Rápido

```bash
# Deploy forçado
npm run deploy

# Deploy com logs
npm run deploy:debug

# Ver logs
npm run deploy:logs
```

## 📋 Scripts Disponíveis

### Windows
```cmd
# Deploy forçado
scripts\deploy.bat

# Ver logs
scripts\logs.bat
scripts\logs.bat follow
scripts\logs.bat error
scripts\logs.bat build
```

### Linux/Mac
```bash
# Deploy forçado
bash scripts/deploy.sh
```

## 🔧 Comandos Vercel CLI

```bash
# Deploy forçado (ignora cache)
vercel --force

# Deploy produção forçado
vercel --prod --force

# Ver logs em tempo real
vercel logs --follow

# Logs últimos 5 minutos
vercel logs --since=5m

# Filtrar erros
vercel logs | findstr /i "error"

# Ver status dos deploys
vercel list

# Debug completo
set VERCEL_DEBUG=1 && vercel --force

# Ver variáveis de ambiente
vercel env ls

# Ver limites
vercel limits
```

## ✅ Plataformas Ativas

### Vercel (Principal)
- Deploy automático via GitHub Actions
- Configuração: `.github/workflows/vercel-deploy.yml`
- Variáveis necessárias no GitHub Secrets:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

### GitHub Actions
- Build e deploy automático no push para `main`
- Workflow: `.github/workflows/build.yml`

## 🔑 Configuração de Secrets

No GitHub: **Settings → Secrets and variables → Actions**

```
VERCEL_TOKEN=seu_token_aqui
VERCEL_ORG_ID=seu_org_id
VERCEL_PROJECT_ID=seu_project_id
```

## 🌐 Variáveis de Ambiente (Vercel)

Configure no painel da Vercel:
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `WEBHOOK_VERIFY_TOKEN`
- `INSTAGRAM_PAGE_ID`
- `INSTAGRAM_ACCESS_TOKEN`
- `DATABASE_URL`
- `NODE_OPTIONS=--max-old-space-size=4096`
