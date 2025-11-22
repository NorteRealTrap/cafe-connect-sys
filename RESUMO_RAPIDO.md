# ⚡ Resumo Rápido - 3 Etapas de Deploy

## 🎯 ETAPA 1: Conectar Repositório na Vercel

1. Acesse: **https://vercel.com**
2. Login com GitHub → Autorizar Vercel
3. **Add New Project** → Selecione seu repositório
4. Configure:
   - Framework: **Vite**
   - Build: `npm run build`
   - Output: `dist`
5. Clique em **Deploy**

✅ **Resultado:** Projeto importado na Vercel

---

## 🔐 ETAPA 2: Configurar Variáveis de Ambiente

1. No projeto Vercel → **Settings** → **Environment Variables**
2. Adicione:

```
NODE_OPTIONS = --max-old-space-size=4096
NODE_ENV = production
```

3. Marque: ✅ Production, ✅ Preview
4. Adicione outras variáveis se necessário (WhatsApp, Instagram, etc.)
5. **Settings** → **Deployments** → **Redeploy** (para aplicar variáveis)

✅ **Resultado:** Variáveis configuradas

---

## 🚀 ETAPA 3: Habilitar Deploy Automático

1. **Settings** → **Git**
2. Verifique:
   - Production Branch: **`main`**
   - Auto-deploy: **Enabled** ✅
   - Preview Deployments: **Enabled** ✅
3. Verifique se repositório está conectado

✅ **Resultado:** Deploy automático ativado

---

## 🧪 TESTAR

```bash
git add .
git commit -m "test deploy"
git push origin main
```

✅ **Resultado:** Deploy automático deve iniciar na Vercel

---

## 📚 Documentação Completa

- **Guia detalhado:** `PASSO_A_PASSO_DEPLOY.md`
- **Checklist:** `CHECKLIST_DEPLOY.md`
- **Guia completo:** `GUIA_DEPLOY_COMPLETO.md`

---

## 🆘 Problemas?

1. Verifique os logs na Vercel
2. Teste build local: `npm run build`
3. Verifique se variáveis estão configuradas
4. Consulte `PASSO_A_PASSO_DEPLOY.md` seção "Problemas Comuns"

---

**Tempo estimado:** 10-15 minutos
