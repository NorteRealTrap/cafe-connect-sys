# ✅ Variáveis de Ambiente - Vercel

## 📋 CHECKLIST - Configure TODAS estas variáveis na Vercel

**Vercel Dashboard → Seu Projeto → Settings → Environment Variables**

### ✅ OBRIGATÓRIAS (Já tem valores)

```env
# Supabase (Frontend - prefixo VITE_)
VITE_SUPABASE_URL=https://vjzdcaswvlecblcrxtou.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqemRjYXN3dmxlY2JsY3J4dG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTkyMDAsImV4cCI6MjA3OTA3NTIwMH0.Diwf-UIkT5fWHyIAFqbamBOBnjFjkVIM98bNT18gaFo

# Supabase (Backend - sem prefixo)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqemRjYXN3dmxlY2JsY3J4dG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQ5OTIwMCwiZXhwIjoyMDc5MDc1MjAwfQ.lRKvAyZc2mMPvrY-tWmplSJkeMKz5JTESiS6xPRR7v4

# Segurança
JWT_SECRET=6ca5301b2a9de527237b79a74e74907466e4fc31c22e40bde6b4c74d50a7d615
WEBHOOK_SECRET=cb1acb26448f770cbc4184c727c9c9100e7e8261e760b090c95b5de622ba7eb0
WEBHOOK_VERIFY_TOKEN=webhook_verify_cafe_2024_secure

# Database
DATABASE_URL=postgresql://postgres:XloJUCEec8EdMIxW@db.vjzdcaswvlecblcrxtou.supabase.co:5432/postgres

# CORS
ALLOWED_ORIGINS=https://cafe-connect-sys.vercel.app,https://seu-dominio-customizado.com

# Node
NODE_ENV=production
```

### ⚠️ FALTANDO (Preencher se usar WhatsApp/Instagram)

```env
# WhatsApp (opcional - deixe vazio se não usar)
WHATSAPP_ACCESS_TOKEN=seu-token-aqui
WHATSAPP_APP_SECRET=seu-secret-aqui
WHATSAPP_PHONE_NUMBER_ID=seu-id-aqui

# Instagram (opcional - deixe vazio se não usar)
INSTAGRAM_ACCESS_TOKEN=seu-token-aqui
INSTAGRAM_APP_SECRET=seu-secret-aqui
INSTAGRAM_PAGE_ID=seu-id-aqui
```

---

## 🎯 IMPORTANTE

### ✅ Variáveis Frontend (VITE_)
- Começam com `VITE_`
- São expostas no browser
- Use para Supabase URL e ANON_KEY

### 🔒 Variáveis Backend (sem prefixo)
- Não começam com `VITE_`
- Ficam apenas no servidor
- Use para secrets, tokens, service keys

### 📍 Ambientes
Adicione para **TODOS** os ambientes:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## ✅ ESTÁ CORRETO SE:

- [ ] Todas as variáveis com `VITE_` estão configuradas
- [ ] `JWT_SECRET` está configurado
- [ ] `DATABASE_URL` está configurado
- [ ] `ALLOWED_ORIGINS` inclui seu domínio Vercel
- [ ] Variáveis adicionadas em Production, Preview e Development

---

## 🚀 APÓS CONFIGURAR

1. Salve as variáveis na Vercel
2. Faça **Redeploy** do projeto
3. Teste o link

**Redeploy:** Vercel Dashboard → Deployments → ⋯ → Redeploy

---

## ⚠️ ATENÇÃO: ALLOWED_ORIGINS

Após o primeiro deploy, atualize:

```env
ALLOWED_ORIGINS=https://seu-dominio-real.vercel.app
```

Substitua pelo domínio real que a Vercel gerou!