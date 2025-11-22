# 🚀 Guia de Implementação das Correções

## Arquivos Criados

### 1. `src/lib/webhook-security.ts`
Validação de assinatura de webhooks do WhatsApp/Instagram.

**Como usar:**
```typescript
import { validateWebhook } from '@/lib/webhook-security';

// Em qualquer endpoint de webhook
if (!validateWebhook(req, process.env.WEBHOOK_SECRET!)) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### 2. `src/lib/rate-limit.ts`
Rate limiting para proteger contra abuso.

**Como usar:**
```typescript
import { rateLimitMiddleware } from '@/lib/rate-limit';

export default async function handler(req, res) {
  const error = rateLimitMiddleware(req, res);
  if (error) return error;
  
  // Seu código aqui
}
```

### 3. `src/lib/async-handler.ts`
Tratamento automático de erros e fetch com timeout.

**Como usar:**
```typescript
import { asyncHandler, fetchWithTimeout } from '@/lib/async-handler';

// Wrapper para funções async
const safeFunction = asyncHandler(async () => {
  // Código que pode falhar
});

// Fetch com timeout e retry
const response = await fetchWithTimeout(
  'https://api.example.com',
  { method: 'POST' },
  10000, // 10s timeout
  3      // 3 retries
);
```

### 4. `src/lib/logger.ts`
Logging estruturado para debugging.

**Como usar:**
```typescript
import { logger } from '@/lib/logger';

logger.info('Order created', { orderId: '123' });
logger.error('Payment failed', { error: err.message });
```

### 5. `src/lib/cors-config.ts`
CORS restritivo e seguro.

**Como usar:**
```typescript
import { configureCORS } from '@/lib/cors-config';

export default async function handler(req, res) {
  const corsError = configureCORS(req, res);
  if (corsError) return corsError;
  
  // Seu código aqui
}
```

### 6. `api/webhook-secure.ts`
Exemplo completo de webhook seguro.

---

## 📋 Passos de Implementação

### Passo 1: Configurar Variáveis de Ambiente

Adicione ao `.env`:
```env
# Webhook Security
WEBHOOK_SECRET=seu_secret_aqui_min_32_chars

# Não use VITE_ para secrets!
WHATSAPP_ACCESS_TOKEN=seu_token
INSTAGRAM_ACCESS_TOKEN=seu_token
```

### Passo 2: Atualizar Webhooks Existentes

Substitua o conteúdo de `api/webhook.ts`:
```typescript
import handler from './webhook-secure';
export default handler;
```

### Passo 3: Proteger Endpoints de API

Em cada arquivo `api/*.ts`:
```typescript
import { rateLimitMiddleware } from '../src/lib/rate-limit';
import { configureCORS } from '../src/lib/cors-config';
import { logger } from '../src/lib/logger';

export default async function handler(req, res) {
  // CORS
  const corsError = configureCORS(req, res);
  if (corsError) return corsError;

  // Rate limit
  const rateLimitError = rateLimitMiddleware(req, res);
  if (rateLimitError) return rateLimitError;

  try {
    // Seu código aqui
    logger.info('Request processed', { path: req.url });
  } catch (error) {
    logger.error('Request failed', { error });
    return res.status(500).json({ error: 'Internal error' });
  }
}
```

### Passo 4: Substituir Fetch por fetchWithTimeout

Em `src/lib/*.ts`:
```typescript
// Antes
const response = await fetch('https://api.example.com');

// Depois
import { fetchWithTimeout } from '@/lib/async-handler';
const response = await fetchWithTimeout('https://api.example.com');
```

### Passo 5: Adicionar Try-Catch em Funções Async

```typescript
// Antes
async function loadOrders() {
  const orders = await db.orders.findMany();
  return orders;
}

// Depois
import { asyncHandler } from '@/lib/async-handler';

const loadOrders = asyncHandler(async () => {
  const orders = await db.orders.findMany();
  return orders;
});
```

---

## 🧪 Testes

### Testar Webhook Security
```bash
# Sem assinatura - deve retornar 401
curl -X POST http://localhost:5173/api/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Com assinatura válida - deve retornar 200
# (gerar assinatura com o script de teste)
```

### Testar Rate Limiting
```bash
# Fazer 101 requisições rápidas - a 101ª deve retornar 429
for i in {1..101}; do
  curl http://localhost:5173/api/orders
done
```

### Testar Timeout
```typescript
// Deve falhar após 10s
await fetchWithTimeout('https://httpstat.us/200?sleep=15000');
```

---

## 📊 Monitoramento

### Logs para Verificar
```bash
# Ver logs estruturados
grep "level.*error" logs.json

# Contar rate limits
grep "Too many requests" logs.json | wc -l

# Ver webhooks inválidos
grep "Invalid webhook signature" logs.json
```

### Métricas Importantes
- Taxa de webhooks rejeitados (deve ser < 1%)
- Requisições bloqueadas por rate limit
- Tempo médio de resposta das APIs
- Erros não tratados (deve ser 0)

---

## 🔄 Próximas Melhorias

1. **Substituir rate-limit em memória por Redis**
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```

2. **Adicionar Sentry para error tracking**
   ```bash
   npm install @sentry/node
   ```

3. **Implementar tabela de webhooks processados**
   ```sql
   CREATE TABLE processed_webhooks (
     id SERIAL PRIMARY KEY,
     webhook_id VARCHAR(255) UNIQUE,
     result JSONB,
     processed_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. **Adicionar testes automatizados**
   ```bash
   npm install -D vitest @testing-library/react
   ```

---

## ❓ FAQ

**P: O rate limit funciona em múltiplas instâncias?**
R: Não, a versão atual usa memória. Para produção, use Redis.

**P: Como gerar o WEBHOOK_SECRET?**
R: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

**P: Preciso mudar o código existente?**
R: Sim, mas de forma incremental. Comece pelos endpoints críticos.

**P: Como testar em desenvolvimento?**
R: Use `ngrok` para expor localhost e configurar webhooks reais.
