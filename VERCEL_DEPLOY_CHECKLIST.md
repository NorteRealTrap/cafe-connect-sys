# ✅ Checklist de Deploy Vercel - Cafe Connect System

## Pré-Deploy (Feito ✅)

- [x] **vercel.json** configurado com rewrites corretos para SPA e API
- [x] **vite.config.ts** simplificado sem configurações problemáticas  
- [x] **package.json** com scripts corretos e dependências necessárias
- [x] **tsconfig.json** configurado adequadamente
- [x] **API functions** com CORS configurado
- [x] **.vercelignore** criado para excluir arquivos desnecessários
- [x] **Dependências** @vercel/node e jsonwebtoken adicionadas

## Deploy Steps

### 1. Teste Local
```bash
# Instalar dependências
npm install

# Testar build
npm run build

# Verificar se não há erros críticos
npm run lint
```

### 2. Configurar Variáveis de Ambiente na Vercel

Acesse: **Vercel Dashboard → Seu Projeto → Settings → Environment Variables**

Adicione TODAS as variáveis (Production, Preview, Development):

```env
JWT_SECRET=sua-chave-jwt-super-secreta-aqui
WHATSAPP_PHONE_NUMBER_ID=seu-phone-number-id
WHATSAPP_ACCESS_TOKEN=seu-access-token
WEBHOOK_VERIFY_TOKEN=seu-verify-token
INSTAGRAM_PAGE_ID=seu-page-id
INSTAGRAM_ACCESS_TOKEN=seu-instagram-token
DATABASE_URL=sua-url-do-banco
ALLOWED_ORIGINS=https://seu-dominio.vercel.app
```

### 3. Deploy

**Opção A - Via Git (Recomendado):**
```bash
git add .
git commit -m "fix: configuração completa Vercel"
git push origin main
```

**Opção B - Via CLI:**
```bash
npx vercel --prod
```

### 4. Verificação Pós-Deploy

- [ ] **Homepage** carrega corretamente
- [ ] **Rotas SPA** funcionam (refresh em /dashboard, /orders, etc.)
- [ ] **API endpoints** respondem:
  - `/api/orders` - GET/POST
  - `/api/auth` - POST
  - `/api/status` - GET
- [ ] **Integração WhatsApp** funciona
- [ ] **Integração Instagram** funciona
- [ ] **Autenticação JWT** funciona
- [ ] **Sem erros 404** em rotas client-side

## Troubleshooting Comum

### ❌ "404 on page refresh"
- Verificar se `vercel.json` tem rewrite para `index.html`

### ❌ "API not working"
- Verificar variáveis de ambiente na Vercel
- Verificar CORS headers nas funções API

### ❌ "Build failed"
- Verificar erros TypeScript
- Verificar dependências em `package.json`

### ❌ "JWT errors"
- Verificar se `JWT_SECRET` está configurado
- Verificar se `@vercel/node` e `jsonwebtoken` estão instalados

## Comandos Úteis

```bash
# Ver logs de deploy
vercel logs

# Testar função específica localmente
vercel dev

# Verificar configuração
vercel inspect

# Redeploy forçado
vercel --prod --force
```

## Contatos de Suporte

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Issues**: Reportar problemas no repositório
- **Logs detalhados**: `vercel logs <deployment-url>`

---

🎉 **Deploy bem-sucedido!** Seu Cafe Connect System está rodando na Vercel!