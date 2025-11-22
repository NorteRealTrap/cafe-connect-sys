# 🔒 Checklist de Correções de Segurança

## ⚠️ CRÍTICO - Implementar IMEDIATAMENTE

### 1. Validação de Webhooks ⏱️ 30min
- [ ] Adicionar validação de assinatura X-Hub-Signature-256
- [ ] Criar helper `verifyWebhookSignature()`
- [ ] Aplicar em `/api/webhook`
- [ ] Testar com webhook real do WhatsApp/Instagram

**Arquivo**: `api/webhook.ts`
**Prioridade**: 🔴 P0

### 2. Proteger Variáveis de Ambiente ⏱️ 20min
- [ ] Auditar todas as variáveis com prefixo `VITE_`
- [ ] Mover tokens/secrets para variáveis sem prefixo
- [ ] Criar endpoints internos em `/api` para chamadas externas
- [ ] Remover hardcoded credentials

**Arquivos**: `src/config/*`, `.env`
**Prioridade**: 🔴 P0

### 3. Rate Limiting ⏱️ 45min
- [ ] Instalar `@upstash/ratelimit` ou similar
- [ ] Criar middleware de rate limit
- [ ] Aplicar em todos os endpoints `/api/*`
- [ ] Configurar limites: 100 req/15min por IP

**Arquivos**: `api/*`
**Prioridade**: 🔴 P0

### 4. Try-Catch em Async ⏱️ 1h
- [ ] Auditar todas as funções async
- [ ] Adicionar try-catch com logging estruturado
- [ ] Criar helper `asyncHandler()`
- [ ] Implementar retry logic para APIs externas

**Arquivos**: `src/lib/*`, `api/*`
**Prioridade**: 🔴 P0

---

## 🟠 ALTO - Implementar esta semana

### 5. Prevenir SQL Injection ⏱️ 30min
- [ ] Verificar uso de queries concatenadas
- [ ] Substituir por prepared statements
- [ ] Adicionar validação Zod em todos os inputs
- [ ] Testar com payloads maliciosos

**Prioridade**: 🟠 P1

### 6. CORS Restritivo ⏱️ 15min
- [ ] Remover `Access-Control-Allow-Origin: *`
- [ ] Configurar whitelist de domínios
- [ ] Adicionar validação de origin
- [ ] Habilitar credentials apenas para domínios confiáveis

**Prioridade**: 🟠 P1

### 7. Autenticação em Endpoints ⏱️ 1h
- [ ] Criar middleware `requireAuth()`
- [ ] Aplicar em `/api/orders`, `/api/status`
- [ ] Implementar verificação de JWT
- [ ] Adicionar rate limit por usuário

**Prioridade**: 🟠 P1

### 8. Logging Estruturado ⏱️ 45min
- [ ] Criar `lib/logger.ts` com Winston/Pino
- [ ] Adicionar logs em todos os webhooks
- [ ] Integrar com Sentry/DataDog
- [ ] Criar dashboard de erros

**Prioridade**: 🟠 P1

### 9. Idempotência de Webhooks ⏱️ 1h
- [ ] Criar tabela `processed_webhooks`
- [ ] Verificar `x-webhook-id` antes de processar
- [ ] Retornar resultado cacheado se já processado
- [ ] Adicionar TTL de 24h para limpeza

**Prioridade**: 🟠 P1

---

## 🟡 MÉDIO - Implementar este mês

### 10. Resolver N+1 Queries ⏱️ 2h
- [ ] Auditar queries com loops
- [ ] Adicionar `include` em Prisma/ORM
- [ ] Implementar DataLoader se necessário
- [ ] Medir performance antes/depois

**Prioridade**: 🟡 P2

### 11. Otimizar Bundle Size ⏱️ 1h
- [ ] Substituir lodash por lodash-es
- [ ] Trocar moment por dayjs
- [ ] Implementar code splitting por rota
- [ ] Lazy load componentes pesados

**Prioridade**: 🟡 P2

### 12. Implementar Caching ⏱️ 1.5h
- [ ] Configurar React Query com staleTime
- [ ] Adicionar Cache-Control em APIs
- [ ] Implementar cache de servidor (Vercel Edge)
- [ ] Cache de dados estáticos (menu, categorias)

**Prioridade**: 🟡 P2

### 13. Timeout em APIs Externas ⏱️ 30min
- [ ] Criar `fetchWithTimeout()` helper
- [ ] Aplicar em chamadas WhatsApp/Instagram
- [ ] Configurar timeout de 10s
- [ ] Adicionar retry com backoff exponencial

**Prioridade**: 🟡 P2

---

## 📊 Métricas de Sucesso

- [ ] 0 vulnerabilidades críticas no npm audit
- [ ] 100% dos endpoints com autenticação
- [ ] < 2s tempo de resposta em 95% das requisições
- [ ] 0 erros não tratados em produção
- [ ] Bundle size < 500KB gzipped

---

## 🛠️ Ferramentas Necessárias

```bash
# Rate limiting
npm install @upstash/ratelimit @upstash/redis

# Logging
npm install winston

# Validação
npm install zod

# Performance
npm install lodash-es dayjs
npm uninstall lodash moment
```

---

## 📝 Ordem de Implementação Recomendada

1. **Dia 1**: Webhooks + Variáveis de Ambiente (50min)
2. **Dia 2**: Rate Limiting + Try-Catch (1h45min)
3. **Dia 3**: SQL Injection + CORS + Auth (1h45min)
4. **Dia 4**: Logging + Idempotência (1h45min)
5. **Semana 2**: Performance (N+1, Bundle, Cache, Timeout)

**Total estimado**: ~12 horas de desenvolvimento
