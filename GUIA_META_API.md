# 🚀 Guia Completo - Integração Meta API (WhatsApp + Instagram)

## 📋 Pré-requisitos

- Conta Meta Business (Facebook Business)
- Página do Facebook
- Conta Instagram Business vinculada
- Número de telefone para WhatsApp Business

---

## 1️⃣ WHATSAPP BUSINESS API

### Passo 1: Criar App no Meta for Developers

1. Acesse: https://developers.facebook.com/
2. Clique em **"Meus Apps"** → **"Criar App"**
3. Selecione tipo: **"Business"**
4. Preencha:
   - Nome do app: `Cafe Connect`
   - Email de contato
   - Conta comercial (crie se não tiver)
5. Clique em **"Criar App"**

### Passo 2: Adicionar WhatsApp ao App

1. No painel do app, clique em **"Adicionar produto"**
2. Encontre **"WhatsApp"** → Clique em **"Configurar"**
3. Selecione sua conta comercial
4. Clique em **"Continuar"**

### Passo 3: Configurar Número de Telefone

1. Na seção WhatsApp → **"Introdução"**
2. Clique em **"Adicionar número de telefone"**
3. Escolha:
   - **Opção A**: Usar número de teste (para desenvolvimento)
   - **Opção B**: Adicionar seu próprio número
4. Siga o processo de verificação (SMS/Chamada)
5. Anote o **Phone Number ID** (aparece após configuração)

### Passo 4: Obter Token de Acesso

**Token Temporário (24h - para testes):**
1. WhatsApp → **"Introdução"**
2. Copie o **"Token de acesso temporário"**

**Token Permanente (produção):**
1. Vá em **"Configurações"** → **"Básico"**
2. Copie o **"ID do App"** e **"Chave Secreta do App"**
3. Crie um token de sistema:
   - Configurações → **"Avançado"** → **"Tokens de acesso do sistema"**
   - Gere token com permissões: `whatsapp_business_messaging`, `whatsapp_business_management`

### Passo 5: Configurar Webhook

1. WhatsApp → **"Configuração"** → **"Webhook"**
2. Clique em **"Editar"**
3. Preencha:
   ```
   URL de retorno de chamada: https://seu-projeto.vercel.app/api/webhook
   Token de verificação: seu_token_secreto_aqui
   ```
4. Clique em **"Verificar e salvar"**
5. Inscreva-se nos campos:
   - ✅ `messages`
   - ✅ `message_status`

### Passo 6: Adicionar Variáveis no Vercel

1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   ```
   WHATSAPP_PHONE_NUMBER_ID = seu_phone_number_id
   WHATSAPP_ACCESS_TOKEN = seu_access_token
   WEBHOOK_VERIFY_TOKEN = seu_token_secreto_aqui
   ```

---

## 2️⃣ INSTAGRAM GRAPH API

### Passo 1: Conectar Instagram ao Facebook

1. Acesse sua **Página do Facebook**
2. Vá em **"Configurações"** → **"Instagram"**
3. Clique em **"Conectar conta"**
4. Faça login na conta Instagram Business
5. Autorize a conexão

### Passo 2: Adicionar Instagram ao App

1. No painel do app Meta, clique em **"Adicionar produto"**
2. Encontre **"Instagram"** → Clique em **"Configurar"**
3. Selecione **"Instagram Graph API"**

### Passo 3: Obter Credenciais

**Page ID:**
1. Acesse: https://developers.facebook.com/tools/explorer/
2. Selecione seu app no dropdown
3. No campo "Get Token", selecione sua página
4. Execute a query: `me?fields=id,name,instagram_business_account`
5. Copie o `instagram_business_account.id`

**Access Token:**
1. No Graph API Explorer
2. Clique em **"Generate Access Token"**
3. Selecione permissões:
   - ✅ `pages_messaging`
   - ✅ `instagram_basic`
   - ✅ `instagram_manage_messages`
   - ✅ `pages_read_engagement`
4. Gere o token
5. Para token permanente, use a ferramenta: https://developers.facebook.com/tools/accesstoken/

### Passo 4: Configurar Webhook Instagram

1. No painel do app → **"Webhooks"**
2. Selecione **"Instagram"**
3. Clique em **"Editar assinatura"**
4. Preencha:
   ```
   URL de retorno de chamada: https://seu-projeto.vercel.app/api/webhook
   Token de verificação: mesmo_token_do_whatsapp
   ```
5. Inscreva-se nos campos:
   - ✅ `messages`
   - ✅ `messaging_postbacks`

### Passo 5: Adicionar Variáveis no Vercel

```
INSTAGRAM_PAGE_ID = seu_instagram_business_account_id
INSTAGRAM_ACCESS_TOKEN = seu_instagram_access_token
```

---

## 3️⃣ TESTAR INTEGRAÇÃO

### Teste WhatsApp

```bash
curl -X POST \
  "https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "text",
    "text": {
      "body": "Olá! Teste de integração."
    }
  }'
```

### Teste Instagram

```bash
curl -X POST \
  "https://graph.facebook.com/v18.0/me/messages" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": {"id": "RECIPIENT_ID"},
    "message": {"text": "Olá! Teste de integração."}
  }'
```

### Teste Webhook

```bash
# Envie uma mensagem para seu número WhatsApp ou Instagram
# Verifique os logs na Vercel: https://vercel.com/seu-projeto/logs
```

---

## 4️⃣ USAR NO SISTEMA

### Enviar Notificação de Pedido

```typescript
import { messagingSystem } from '@/lib/messaging-integration';

// Notificar cliente sobre status do pedido
await messagingSystem.notifyOrderStatus(
  '5511999999999',  // Telefone do cliente
  'PED-123',        // Número do pedido
  'preparando'      // Status
);
```

### Enviar Mensagem Personalizada

```typescript
import { whatsappAPI, getMessagingConfig } from '@/lib/messaging-integration';

const config = getMessagingConfig().whatsapp;

await whatsappAPI.sendMessage(
  '5511999999999',
  'Seu pedido está pronto para retirada!',
  config
);
```

---

## 5️⃣ CRIAR TEMPLATES (WhatsApp)

### No WhatsApp Manager

1. Acesse: https://business.facebook.com/wa/manage/message-templates/
2. Clique em **"Criar modelo"**
3. Exemplo de template:

**Nome:** `order_status`
**Categoria:** Transacional
**Idioma:** Português (BR)

**Conteúdo:**
```
Olá {{1}}! 

Seu pedido #{{2}} está {{3}}.

{{4}}

Obrigado pela preferência!
```

4. Envie para aprovação (leva 24-48h)

### Usar Template no Código

```typescript
await whatsappAPI.sendTemplate(
  '5511999999999',
  'order_status',
  config
);
```

---

## 6️⃣ MONITORAMENTO

### Ver Logs na Vercel

1. Acesse: https://vercel.com/seu-projeto
2. Vá em **"Logs"**
3. Filtre por `/api/webhook`

### Ver Mensagens Recebidas

```typescript
// No console do navegador
const notifications = JSON.parse(
  localStorage.getItem('ccpservices-notifications') || '[]'
);
console.table(notifications);
```

---

## 7️⃣ LIMITES E CUSTOS

### WhatsApp Business API

- **Gratuito**: 1.000 conversas/mês
- **Pago**: $0.005 - $0.09 por conversa (varia por país)
- **Rate Limit**: 80 mensagens/segundo

### Instagram Graph API

- **Gratuito**: Uso básico
- **Rate Limit**: 200 mensagens/hora por usuário

---

## 8️⃣ TROUBLESHOOTING

### Webhook não recebe mensagens

1. Verifique se o webhook está verificado (✅ verde)
2. Teste manualmente: `https://seu-projeto.vercel.app/api/webhook?hub.mode=subscribe&hub.verify_token=SEU_TOKEN&hub.challenge=test`
3. Verifique logs na Vercel

### Erro "Invalid access token"

1. Gere novo token
2. Verifique se tem as permissões corretas
3. Para produção, use token de sistema (não expira)

### Mensagens não são enviadas

1. Verifique se o número está no formato internacional: `5511999999999`
2. Confirme que o token tem permissão `whatsapp_business_messaging`
3. Verifique se o número está na lista de testes (modo desenvolvimento)

---

## 📚 Documentação Oficial

- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Webhooks](https://developers.facebook.com/docs/graph-api/webhooks)
- [Meta Business Suite](https://business.facebook.com/)

---

## ✅ Checklist Final

- [ ] App criado no Meta for Developers
- [ ] WhatsApp configurado e número verificado
- [ ] Instagram conectado à página do Facebook
- [ ] Tokens obtidos e salvos na Vercel
- [ ] Webhook configurado e verificado
- [ ] Teste de envio realizado com sucesso
- [ ] Teste de recebimento funcionando
- [ ] Templates criados e aprovados (se necessário)

🎉 **Integração completa!**
