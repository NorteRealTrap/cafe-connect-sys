// Sistema Multi-Tenant para WhatsApp e Instagram

export interface MessagingCredentials {
  userId: string;
  businessName: string;
  whatsapp?: {
    phoneNumberId: string;
    accessToken: string;
    businessAccountId: string;
    phoneNumber: string;
  };
  instagram?: {
    pageId: string;
    accessToken: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Gerenciador de credenciais por usuário
export const credentialsManager = {
  // Salvar credenciais do usuário
  saveCredentials: (userId: string, credentials: Omit<MessagingCredentials, 'userId' | 'createdAt' | 'updatedAt'>) => {
    const allCredentials = JSON.parse(localStorage.getItem('messaging-credentials') || '{}');
    
    allCredentials[userId] = {
      userId,
      ...credentials,
      createdAt: allCredentials[userId]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('messaging-credentials', JSON.stringify(allCredentials));
    return allCredentials[userId];
  },

  // Obter credenciais do usuário
  getCredentials: (userId: string): MessagingCredentials | null => {
    const allCredentials = JSON.parse(localStorage.getItem('messaging-credentials') || '{}');
    return allCredentials[userId] || null;
  },

  // Remover credenciais
  removeCredentials: (userId: string) => {
    const allCredentials = JSON.parse(localStorage.getItem('messaging-credentials') || '{}');
    delete allCredentials[userId];
    localStorage.setItem('messaging-credentials', JSON.stringify(allCredentials));
  },

  // Verificar se usuário tem credenciais configuradas
  hasCredentials: (userId: string): boolean => {
    const credentials = credentialsManager.getCredentials(userId);
    return !!(credentials?.whatsapp || credentials?.instagram);
  }
};

// API Multi-Tenant para WhatsApp
export const multiTenantWhatsApp = {
  // Enviar mensagem usando credenciais do usuário
  sendMessage: async (userId: string, to: string, message: string) => {
    const credentials = credentialsManager.getCredentials(userId);
    
    if (!credentials?.whatsapp) {
      throw new Error('WhatsApp não configurado para este usuário');
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${credentials.whatsapp.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${credentials.whatsapp.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to.replace(/\D/g, ''),
            type: 'text',
            text: { body: message }
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Erro ao enviar mensagem');
      }

      return data;
    } catch (error) {
      console.error('Erro WhatsApp:', error);
      throw error;
    }
  },

  // Testar conexão
  testConnection: async (userId: string) => {
    const credentials = credentialsManager.getCredentials(userId);
    
    if (!credentials?.whatsapp) {
      return { success: false, error: 'Credenciais não configuradas' };
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${credentials.whatsapp.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${credentials.whatsapp.accessToken}`
          }
        }
      );

      if (response.ok) {
        return { success: true, message: 'Conexão WhatsApp OK' };
      } else {
        return { success: false, error: 'Token inválido ou expirado' };
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    }
  }
};

// API Multi-Tenant para Instagram
export const multiTenantInstagram = {
  // Enviar mensagem usando credenciais do usuário
  sendMessage: async (userId: string, recipientId: string, message: string) => {
    const credentials = credentialsManager.getCredentials(userId);
    
    if (!credentials?.instagram) {
      throw new Error('Instagram não configurado para este usuário');
    }

    try {
      const response = await fetch(
        'https://graph.facebook.com/v18.0/me/messages',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${credentials.instagram.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recipient: { id: recipientId },
            message: { text: message }
          })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Erro ao enviar mensagem');
      }

      return data;
    } catch (error) {
      console.error('Erro Instagram:', error);
      throw error;
    }
  },

  // Testar conexão
  testConnection: async (userId: string) => {
    const credentials = credentialsManager.getCredentials(userId);
    
    if (!credentials?.instagram) {
      return { success: false, error: 'Credenciais não configuradas' };
    }

    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${credentials.instagram.pageId}?fields=id,name`,
        {
          headers: {
            'Authorization': `Bearer ${credentials.instagram.accessToken}`
          }
        }
      );

      if (response.ok) {
        return { success: true, message: 'Conexão Instagram OK' };
      } else {
        return { success: false, error: 'Token inválido ou expirado' };
      }
    } catch (error) {
      return { success: false, error: 'Erro de conexão' };
    }
  }
};

// Sistema de notificações multi-tenant
export const multiTenantNotifications = {
  // Enviar notificação de pedido
  notifyOrderStatus: async (userId: string, phone: string, orderNumber: string, status: string) => {
    const messages: Record<string, string> = {
      'aceito': `✅ Pedido #${orderNumber} aceito! Estamos preparando seu pedido.`,
      'preparando': `👨‍🍳 Pedido #${orderNumber} em preparo! Em breve estará pronto.`,
      'pronto': `🎉 Pedido #${orderNumber} pronto! Pode retirar ou aguardar a entrega.`,
      'saiu-entrega': `🚚 Pedido #${orderNumber} saiu para entrega! Chegando em breve.`,
      'entregue': `✨ Pedido #${orderNumber} entregue! Obrigado pela preferência!`
    };

    const message = messages[status] || `Pedido #${orderNumber} - Status: ${status}`;

    try {
      await multiTenantWhatsApp.sendMessage(userId, phone, message);
      
      // Salvar log
      const logs = JSON.parse(localStorage.getItem('notification-logs') || '[]');
      logs.push({
        userId,
        phone,
        message,
        status,
        orderNumber,
        timestamp: new Date().toISOString(),
        success: true
      });
      localStorage.setItem('notification-logs', JSON.stringify(logs.slice(-100)));
      
      return { success: true };
    } catch (error) {
      // Salvar log de erro
      const logs = JSON.parse(localStorage.getItem('notification-logs') || '[]');
      logs.push({
        userId,
        phone,
        message,
        status,
        orderNumber,
        timestamp: new Date().toISOString(),
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      localStorage.setItem('notification-logs', JSON.stringify(logs.slice(-100)));
      
      throw error;
    }
  }
};
