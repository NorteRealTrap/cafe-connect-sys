# 🚀 Guia Completo - Sistema Café Connect

## ✅ STATUS ATUAL DO PROJETO

**Implementado:**
- ✅ Autenticação JWT com bcrypt
- ✅ API de pedidos protegida
- ✅ API de comentários
- ✅ Banco de dados Neon configurado
- ✅ Deploy automático na Vercel
- ✅ Sistema de login funcional

**Credenciais de Teste:**
- Email: `admin@cafeconnect.com`
- Senha: `admintester12345`
- Role: `admin`

## 📦 Dependências Instaladas

```json
{
  "dependencies": {
    "@neondatabase/serverless": "^1.0.2",
    "bcryptjs": "latest",
    "jsonwebtoken": "latest",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "@vercel/node": "^5.5.10",
    "@types/bcryptjs": "latest",
    "@types/jsonwebtoken": "latest"
  }
}
```

## 🗄️ Banco de Dados

**Arquivo:** `complete-schema.sql`

**Tabelas:**
1. `users` - Usuários do sistema
2. `orders` - Pedidos
3. `order_items` - Itens dos pedidos
4. `comments` - Comentários
5. `webhook_logs` - Logs de webhooks

**Para executar:**
1. Acesse [console.neon.tech](https://console.neon.tech)
2. Selecione seu projeto
3. Vá em SQL Editor
4. Cole o conteúdo de `complete-schema.sql`
5. Execute

## 🔐 Variáveis de Ambiente

**Arquivo `.env.development.local` (já configurado):**
```env
DATABASE_URL="postgresql://..."
NEON_DB_DATABASE_URL="postgresql://..."
JWT_SECRET="6ca5301b2a9de527237b79a74e74907466e4fc31c22e40bde6b4c74d50a7d615"
```

**Na Vercel (configurar):**
1. Settings → Environment Variables
2. Adicionar:
   - `NEON_DB_DATABASE_URL`
   - `JWT_SECRET`

## 📡 APIs Disponíveis

### 1. `/api/auth` - Autenticação
- POST - Login
- Retorna JWT token

### 2. `/api/orders-new` - Pedidos (Protegida)
- GET - Listar pedidos
- POST - Criar pedido
- PUT - Atualizar pedido
- DELETE - Cancelar pedido

### 3. `/api/comments` - Comentários
- GET - Listar comentários
- POST - Criar comentário

## 🧪 Como Testar

### Localmente:
```bash
npm run dev
```

Acesse: `http://localhost:5173`

### Produção:
```bash
git push origin main
```

Vercel faz deploy automático!

## 📝 Próximos Passos

1. ✅ Execute `complete-schema.sql` no Neon
2. ✅ Configure variáveis na Vercel
3. ✅ Teste o login
4. ⏳ Implemente componentes de pedidos
5. ⏳ Adicione webhooks WhatsApp/Instagram

## 🔗 Links Úteis

- Neon Console: https://console.neon.tech
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub Repo: https://github.com/NorteRealTrap/cafe-connect-sys

## 📞 Suporte

Dúvidas? Abra uma issue no GitHub!
