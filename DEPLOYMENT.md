# Guia de Deploy - Cafe Connect System

## Pré-requisitos

- [ ] Node.js 18+ instalado
- [ ] Conta Vercel ou Netlify configurada
- [ ] Variáveis de ambiente configuradas
- [ ] Testes passando
- [ ] Build local funcionando

## Checklist de Deploy

### 1. Segurança
- [ ] JWT_SECRET configurado com valor forte (32+ caracteres)
- [ ] VITE_DEFAULT_PASSWORD alterado ou removido
- [ ] ALLOWED_ORIGINS configurado com domínios de produção
- [ ] Credenciais padrão alteradas
- [ ] .env não commitado (verificar .gitignore)
- [ ] Tokens de API em variáveis de ambiente
- [ ] HTTPS habilitado

### 2. Configuração de Ambiente

#### Vercel
```bash
# Configurar variáveis de ambiente
vercel env add JWT_SECRET
vercel env add VITE_DEFAULT_PASSWORD
vercel env add ALLOWED_ORIGINS
vercel env add DATABASE_URL

# Deploy
npm run deploy
```

#### Netlify
```bash
# Configurar no netlify.toml ou dashboard
# Deploy
netlify deploy --prod
```

### 3. Variáveis de Ambiente Obrigatórias

**Backend (Vercel/Netlify Functions)**
```env
JWT_SECRET=<strong-random-secret-32-chars>
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
DATABASE_URL=<your-database-url>
WHATSAPP_ACCESS_TOKEN=<if-using-whatsapp>
INSTAGRAM_ACCESS_TOKEN=<if-using-instagram>
WEBHOOK_VERIFY_TOKEN=<if-using-webhooks>
```

**Frontend (Build Time)**
```env
VITE_API_URL=https://api.yourdomain.com
REACT_APP_STORAGE_KEY=<unique-key>
REACT_APP_STATUS_STORAGE_KEY=<unique-key>
REACT_APP_TABLES_STORAGE_KEY=<unique-key>
```

### 4. Build e Testes

```bash
# Instalar dependências
npm install

# Executar testes
npm test

# Build de produção
npm run build

# Preview local
npm run preview
```

### 5. Pós-Deploy

- [ ] Testar login com credenciais de produção
- [ ] Verificar CORS funcionando
- [ ] Testar todas as funcionalidades principais
- [ ] Verificar logs de erro
- [ ] Configurar monitoramento (Sentry, LogRocket, etc)
- [ ] Configurar backup automático
- [ ] Documentar credenciais em local seguro (1Password, etc)

### 6. Monitoramento

**Logs**
```bash
# Vercel
vercel logs --since=1h

# Netlify
netlify logs
```

**Métricas para Monitorar**
- Taxa de erro de autenticação
- Tempo de resposta da API
- Uso de recursos
- Tentativas de login falhadas
- Rate limiting acionado

### 7. Rollback

**Vercel**
```bash
vercel rollback
```

**Netlify**
```bash
netlify rollback
```

## Troubleshooting

### Erro: JWT_SECRET não configurado
- Verificar variáveis de ambiente no dashboard
- Redeployar após configurar

### Erro: CORS bloqueado
- Verificar ALLOWED_ORIGINS
- Adicionar domínio de produção

### Erro: Rate limit muito restritivo
- Ajustar maxRequestsPerWindow em security.ts
- Considerar usar Redis para rate limiting distribuído

## Contato de Suporte

- Email: support@cafeconnect.com
- Documentação: https://docs.cafeconnect.com
- Status: https://status.cafeconnect.com
