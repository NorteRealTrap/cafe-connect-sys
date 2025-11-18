// Integração com WhatsApp Business API e Instagram Graph API

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  webhookVerifyToken: string;
}

interface InstagramConfig {
  pageId: string;
  accessToken: string;
}

// WhatsApp Business API Integration
export const whatsappAPI = {
  // Enviar mensagem via WhatsApp Business API
  sendMessage: async (to: string, message: string, config: WhatsAppConfig) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/\D/g, ''),
          type: 'text',
          text: { body: message }
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      throw error;
    }
  },

  // Enviar mensagem com template
  sendTemplate: async (to: string, templateName: string, config: WhatsAppConfig) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/\D/g, ''),
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'pt_BR' }
          }
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar template WhatsApp:', error);
      throw error;
    }
  }
};

// Instagram Graph API Integration
export const instagramAPI = {
  // Enviar mensagem via Instagram Direct
  sendMessage: async (recipientId: string, message: string, config: InstagramConfig) => {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/me/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message }
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar Instagram DM:', error);
      throw error;
    }
  },

  // Buscar mensagens recebidas
  getMessages: async (config: InstagramConfig) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${config.pageId}/conversations?fields=messages{message,from,created_time}&access_token=${config.accessToken}`
      );
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar mensagens Instagram:', error);
      throw error;
    }
  }
};

// Sistema de notificações unificado
export const messagingSystem = {
  // Enviar notificação de pedido
  notifyOrderStatus: async (phone: string, orderNumber: string, status: string) => {
    const messages = {
      'aceito': `✅ Pedido #${orderNumber} aceito! Estamos preparando seu pedido.`,
      'preparando': `👨‍🍳 Pedido #${orderNumber} em preparo! Em breve estará pronto.`,
      'pronto': `🎉 Pedido #${orderNumber} pronto! Pode retirar ou aguardar a entrega.`,
      'saiu-entrega': `🚚 Pedido #${orderNumber} saiu para entrega! Chegando em breve.`,
      'entregue': `✨ Pedido #${orderNumber} entregue! Obrigado pela preferência!`
    };

    const message = messages[status as keyof typeof messages] || `Pedido #${orderNumber} - Status: ${status}`;
    
    // Aqui você integraria com WhatsApp Business API
    console.log(`Enviando para ${phone}: ${message}`);
    
    // Salvar no localStorage para simulação
    const notifications = JSON.parse(localStorage.getItem('ccpservices-notifications') || '[]');
    notifications.push({
      id: Date.now().toString(),
      phone,
      message,
      status,
      timestamp: new Date().toISOString(),
      sent: false
    });
    localStorage.setItem('ccpservices-notifications', JSON.stringify(notifications));
  },

  // Webhook handler para receber mensagens
  handleWebhook: (data: any) => {
    // Processar webhook do WhatsApp/Instagram
    if (data.object === 'whatsapp_business_account') {
      const messages = data.entry?.[0]?.changes?.[0]?.value?.messages || [];
      messages.forEach((msg: any) => {
        console.log('Nova mensagem WhatsApp:', msg);
        // Salvar mensagem no sistema
      });
    }
    
    if (data.object === 'instagram') {
      const messaging = data.entry?.[0]?.messaging || [];
      messaging.forEach((msg: any) => {
        console.log('Nova mensagem Instagram:', msg);
        // Salvar mensagem no sistema
      });
    }
  }
};

// Configuração de exemplo (deve ser movida para variáveis de ambiente)
export const getMessagingConfig = () => {
  return {
    whatsapp: {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_TOKEN || ''
    },
    instagram: {
      pageId: process.env.INSTAGRAM_PAGE_ID || '',
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || ''
    }
  };
};
