# ⚡ DEPLOY RÁPIDO - Lovable → Vercel

## 🎯 3 PASSOS SIMPLES

### 1️⃣ Conectar GitHub (se ainda não fez)
```
Lovable.dev → Settings → Developers → Connect to GitHub
```

### 2️⃣ Importar na Vercel
```
vercel.com → Add New → Project → Importar cafe-connect-sys
```

### 3️⃣ Configurar e Deploy
```
Framework: Vite
Build: npm run build
Output: dist

Adicionar variáveis de ambiente:
- JWT_SECRET
- WHATSAPP_ACCESS_TOKEN
- DATABASE_URL
- etc.

Clicar em DEPLOY
```

## ✅ PRONTO!

Seu link Vercel funcionará em ~2 minutos.

---

## 🔧 Variáveis de Ambiente Obrigatórias

```env
JWT_SECRET=sua-chave-secreta
WHATSAPP_PHONE_NUMBER_ID=seu-id
WHATSAPP_ACCESS_TOKEN=seu-token
WEBHOOK_VERIFY_TOKEN=seu-token
INSTAGRAM_PAGE_ID=seu-id
INSTAGRAM_ACCESS_TOKEN=seu-token
DATABASE_URL=sua-url
ALLOWED_ORIGINS=https://seu-dominio.vercel.app
```

---

## 🐛 Problema Comum

**❌ "404 ao atualizar página"**
✅ Já corrigido! O vercel.json está configurado corretamente.

**❌ "API não funciona"**
✅ Configure as variáveis de ambiente na Vercel.

**❌ "Build falhou"**
✅ Verifique se todas as dependências estão no package.json.

---

## 📋 Checklist Final

- [ ] Código no GitHub
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] Link funcionando

🎉 **SUCESSO!**