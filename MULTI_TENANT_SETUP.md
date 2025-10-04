# 🏢 Sistema Multi-Tenant - Guia de Uso

## 📌 Visão Geral

Cada usuário/empresa pode configurar suas próprias credenciais de WhatsApp e Instagram, permitindo que múltiplos negócios usem o sistema com suas próprias contas de comunicação.

## 🔐 Como Funciona

### 1. Credenciais por Usuário

Cada usuário tem suas próprias credenciais armazenadas localmente:

```typescript
{
  "user-123": {
    "businessName": "Restaurante A",
    "whatsapp": {
      "phoneNumberId": "...",
      "accessToken": "...",
      "phoneNumber": "+55 11 99999-9999"
    },
    "instagram": {
      "pageId": "...",
      "accessToken": "...",
      "username": "@restaurante_a"
    }
  },
  "user-456": {
    "businessName": "Café B",
    "whatsapp": { ... },
    "instagram": { ... }
  }
}
```

### 2. Isolamento de Dados

- Cada usuário só acessa suas próprias credenciais
- Mensagens são enviadas usando as credenciais do usuário logado
- Logs de notificações são separados por usuário

## 🚀 Configuração Passo a Passo

### Para o Usuário Final

1. **Acessar Configurações**
   - Faça login no sistema
   - Vá em "Comunicação" no menu principal
   - Clique em "Configurar Canais"

2. **Configurar WhatsApp**
   - Obtenha suas credenciais no Meta for Developers (veja `GUIA_META_API.md`)
   - Preencha:
     - Phone Number ID
     - Access Token
     - Business Account ID (opcional)
     - Número de Telefone (opcional)
   - Clique em "Salvar WhatsApp"
   - Clique em "Testar Conexão" para verificar

3. **Configurar Instagram**
   - Obtenha suas credenciais no Meta for Developers
   - Preencha:
     - Instagram Page ID
     - Access Token
     - Username (opcional)
   - Clique em "Salvar Instagram"
   - Clique em "Testar Conexão" para verificar

4. **Usar o Sistema**
   - Após configurar, as notificações automáticas serão enviadas
   - Você pode enviar mensagens manuais pela Central de Comunicação

## 💻 Para Desenvolvedores

### Enviar Mensagem WhatsApp

```typescript
import { multiTenantWhatsApp } from '@/lib/multi-tenant-messaging';

const userId = localStorage.getItem('current-user-id');

await multiTenantWhatsApp.sendMessage(
  userId,
  '5511999999999',
  'Seu pedido está pronto!'
);
```

### Enviar Notificação de Pedido

```typescript
import { multiTenantNotifications } from '@/lib/multi-tenant-messaging';

const userId = localStorage.getItem('current-user-id');

await multiTenantNotifications.notifyOrderStatus(
  userId,
  '5511999999999',
  'PED-123',
  'preparando'
);
```

### Verificar se Usuário Tem Credenciais

```typescript
import { credentialsManager } from '@/lib/multi-tenant-messaging';

const userId = localStorage.getItem('current-user-id');
const hasCredentials = credentialsManager.hasCredentials(userId);

if (!hasCredentials) {
  // Mostrar aviso para configurar
}
```

### Gerenciar Credenciais

```typescript
import { credentialsManager } from '@/lib/multi-tenant-messaging';

// Salvar
credentialsManager.saveCredentials(userId, {
  businessName: 'Minha Empresa',
  whatsapp: { ... },
  instagram: { ... }
});

// Obter
const credentials = credentialsManager.getCredentials(userId);

// Remover
credentialsManager.removeCredentials(userId);
```

## 🔒 Segurança

### Armazenamento Local

- Credenciais são armazenadas no `localStorage` do navegador
- Cada usuário só acessa suas próprias credenciais
- Tokens são mascarados na interface (type="password")

### Recomendações para Produção

1. **Migrar para Backend**
   - Armazenar credenciais em banco de dados criptografado
   - Usar API do backend para enviar mensagens
   - Implementar rate limiting

2. **Criptografia**
   ```typescript
   // Exemplo de criptografia básica
   const encrypted = btoa(JSON.stringify(credentials));
   localStorage.setItem('credentials', encrypted);
   ```

3. **Tokens de Longa Duração**
   - Use tokens de sistema (não expiram)
   - Implemente refresh token automático
   - Monitore validade dos tokens

## 📊 Monitoramento

### Ver Logs de Notificações

```typescript
const logs = JSON.parse(
  localStorage.getItem('notification-logs') || '[]'
);

console.table(logs);
```

### Estrutura do Log

```typescript
{
  userId: 'user-123',
  phone: '5511999999999',
  message: 'Pedido #123 pronto!',
  status: 'pronto',
  orderNumber: '123',
  timestamp: '2024-01-15T10:30:00Z',
  success: true,
  error?: 'Mensagem de erro se falhou'
}
```

## 🔄 Fluxo de Notificações Automáticas

1. **Pedido Criado** → Nenhuma notificação
2. **Pedido Aceito** → ✅ "Pedido aceito! Estamos preparando..."
3. **Em Preparo** → 👨‍🍳 "Pedido em preparo! Em breve estará pronto."
4. **Pronto** → 🎉 "Pedido pronto! Pode retirar..."
5. **Saiu para Entrega** → 🚚 "Pedido saiu para entrega!"
6. **Entregue** → ✨ "Pedido entregue! Obrigado!"

## ❓ Troubleshooting

### "WhatsApp não configurado para este usuário"

- Verifique se você configurou as credenciais
- Vá em Comunicação → Configurar Canais
- Salve e teste a conexão

### "Token inválido ou expirado"

- Gere um novo token no Meta for Developers
- Atualize nas configurações
- Use tokens de sistema para produção

### Mensagens não são enviadas

- Verifique se o número está no formato internacional: `5511999999999`
- Confirme que o token tem as permissões corretas
- Verifique os logs de notificação para ver o erro específico

## 🎯 Próximos Passos

1. Configure suas credenciais no sistema
2. Teste enviando uma mensagem manual
3. Crie um pedido e veja as notificações automáticas
4. Monitore os logs para garantir que tudo funciona
5. Para produção, migre credenciais para backend seguro

## 📚 Documentação Relacionada

- `GUIA_META_API.md` - Como obter credenciais Meta
- `INTEGRACAO_MENSAGENS.md` - Detalhes técnicos da integração
- `README.md` - Informações gerais do projeto
