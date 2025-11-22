# 🏗️ Arquitetura JWT - Cafe Connect Sys

## ✅ Arquitetura Correta Implementada

### Separação Frontend/Backend

```
cafe-connect-sys/
├── src/                          # ✅ Frontend (React/Vite)
│   ├── lib/
│   │   ├── auth-client.ts       # ✅ Cliente de autenticação
│   │   ├── api-client.ts        # ✅ Chamadas à API
│   │   └── security.ts          # ✅ Validações frontend
│   └── ...
├── api/                          # ✅ Backend (Serverless)
│   ├── auth.ts                  # ✅ JWT geração (Node.js)
│   ├── verify-token.ts          # ✅ Verificação de token
│   └── ...
└── .env
```

## 📦 Dependências

### Backend (api/)
```json
{
  "dependencies": {
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcryptjs": "^2.4.6"
  }
}
```

### Frontend (src/)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
    // ❌ SEM jsonwebtoken
  }
}
```

## 🔐 Fluxo de Autenticação

### 1. Login (Frontend → Backend)
```typescript
// Frontend: src/lib/auth-client.ts
import { login } from '@/lib/auth-client';

const response = await login({
  email: 'user@example.com',
  password: 'senha123'
});
// Token armazenado no localStorage
```

### 2. Geração de Token (Backend)
```typescript
// Backend: api/auth.ts
const token = jwt.sign(
  { userId, email, role },
  JWT_SECRET,
  { expiresIn: '7d' }
);
```

### 3. Requisições Autenticadas
```typescript
// Frontend: src/lib/api-client.ts
import { authenticatedFetch } from '@/lib/api-client';

const orders = await authenticatedFetch('/api/orders');
```

### 4. Verificação (Backend)
```typescript
// Backend: api/verify-token.ts
const decoded = jwt.verify(token, JWT_SECRET);
```

## 📝 Arquivos Criados

### Frontend
- ✅ `src/lib/auth-client.ts` - Cliente de autenticação
- ✅ `src/lib/api-client.ts` - Cliente API
- ❌ `src/lib/jwt.ts` - REMOVIDO (não deve existir)

### Backend
- ✅ `api/auth.ts` - Autenticação e geração de token
- ✅ `api/verify-token.ts` - Verificação de token
- ✅ `api/middleware/security.ts` - Middleware de segurança

## 🎯 Uso nos Componentes

### Login Component
```typescript
import { login } from '@/lib/auth-client';

const handleLogin = async () => {
  try {
    await login({ email, password });
    navigate('/dashboard');
  } catch (error) {
    toast.error('Login falhou');
  }
};
```

### Protected Route
```typescript
import { isAuthenticated } from '@/lib/auth-client';

if (!isAuthenticated()) {
  return <Navigate to="/login" />;
}
```

### API Call
```typescript
import { authenticatedFetch } from '@/lib/api-client';

const data = await authenticatedFetch('/api/orders');
```

## ✅ Vantagens desta Arquitetura

1. **Segurança**: JWT apenas no backend
2. **Performance**: Frontend leve
3. **Compatibilidade**: Sem warnings de build
4. **Escalabilidade**: Fácil adicionar novos endpoints
5. **Manutenção**: Separação clara de responsabilidades

## 🚀 Deploy

### Vercel
- Backend (api/) roda como Serverless Functions
- Frontend (src/) roda como Static Site
- Variáveis de ambiente configuradas no dashboard

### Variáveis de Ambiente
```env
JWT_SECRET=<secret-key>
JWT_EXPIRES_IN=7d
DATABASE_URL=<database-url>
```

## 📊 Status

- ✅ Arquitetura correta implementada
- ✅ JWT apenas no backend
- ✅ Frontend sem dependências Node.js
- ✅ Build funcionando
- ✅ Deploy em produção

---
**Última atualização**: 2024
