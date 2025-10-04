# Guia de Integração - WhatsApp e Instagram

## 📱 WhatsApp Business API

### Pré-requisitos
1. Conta Meta Business (Facebook Business)
2. WhatsApp Business API aprovada
3. Número de telefone verificado

### Configuração

#### 1. Criar App no Meta for Developers
- Acesse: https://developers.facebook.com/
- Crie um novo app tipo "Business"
- Adicione o produto "WhatsApp"

#### 2. Obter Credenciais
```env
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_ACCESS_TOKEN=seu_access_token
WHATSAPP_WEBHOOK_TOKEN=seu_webhook_verify_token
```

#### 3. Configurar Webhook (Vercel)
- URL: `https://seu-dominio.vercel.app/api/webhook`
- Verify Token: mesmo do `.env`
- Eventos: `messages`, `message_status`

### Código de Exemplo

```typescript
import { whatsappAPI, getMessagingConfig } from '@/lib/messaging-integration';

// Enviar mensagem
const config = getMessagingConfig().whatsapp;
await whatsappAPI.sendMessage('5511999999999', 'Seu pedido está pronto!', config);

// Enviar template aprovado
await whatsappAPI.sendTemplate('5511999999999', 'order_confirmation', config);
```

## 📸 Instagram Graph API

### Pré-requisitos
1. Página do Instagram Business
2. Página do Facebook vinculada
3. Permissões: `pages_messaging`, `instagram_basic`, `instagram_manage_messages`

### Configuração

#### 1. Conectar Instagram ao Facebook
- Acesse Configurações da Página do Facebook
- Instagram > Conectar Conta

#### 2. Obter Credenciais
```env
INSTAGRAM_PAGE_ID=seu_page_id
INSTAGRAM_ACCESS_TOKEN=seu_access_token
```

#### 3. Configurar Webhook (Vercel)
- URL: `https://seu-dominio.vercel.app/api/webhook`
- Eventos: `messages`, `messaging_postbacks`

### Código de Exemplo

```typescript
import { instagramAPI, getMessagingConfig } from '@/lib/messaging-integration';

// Enviar mensagem
const config = getMessagingConfig().instagram;
await instagramAPI.sendMessage('recipient_id', 'Obrigado pela mensagem!', config);

// Buscar mensagens
const messages = await instagramAPI.getMessages(config);
```

## 🔔 Sistema de Notificações Automáticas

### Integração com Pedidos

O sistema já está preparado para enviar notificações automáticas:

```typescript
import { messagingSystem } from '@/lib/messaging-integration';

// Notificar mudança de status
await messagingSystem.notifyOrderStatus(
  '5511999999999',
  'PED-123',
  'preparando'
);
```

### Status Suportados
- `aceito` - Pedido aceito
- `preparando` - Em preparo
- `pronto` - Pronto para retirada/entrega
- `saiu-entrega` - Saiu para entrega
- `entregue` - Entregue ao cliente

## 🌐 Webhook Handler (Vercel)

O arquivo já foi criado em `api/webhook.ts` e está pronto para uso!

**Endpoint:** `https://seu-dominio.vercel.app/api/webhook`

## 🔐 Variáveis de Ambiente

Adicione ao `.env`:

```env
# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxx
WHATSAPP_WEBHOOK_TOKEN=seu_token_secreto

# Instagram Graph API
INSTAGRAM_PAGE_ID=987654321
INSTAGRAM_ACCESS_TOKEN=EAAxxxxxxxxxxxxx
```

## 📊 Monitoramento

O sistema salva todas as notificações em `localStorage`:

```typescript
// Ver notificações enviadas
const notifications = JSON.parse(
  localStorage.getItem('ccpservices-notifications') || '[]'
);
console.log(notifications);
```

## 🚀 Próximos Passos

1. **Obter aprovação Meta Business** para produção
2. **Criar templates de mensagem** no WhatsApp Business Manager
3. **Configurar webhooks** no servidor de produção
4. **Testar integração** em ambiente de desenvolvimento
5. **Implementar rate limiting** para evitar bloqueios

## 📚 Documentação Oficial

- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Meta Business SDK](https://developers.facebook.com/docs/javascript)

## ⚠️ Limitações

- WhatsApp: 1000 conversas gratuitas/mês
- Instagram: Rate limit de 200 mensagens/hora
- Ambos requerem aprovação Meta para produção
