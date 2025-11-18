// Utilitário para limpar caches e corrigir dados corrompidos

export const cacheCleaner = {
  // Limpar todos os caches do navegador
  clearBrowserCaches: async () => {
    try {
      // Limpar cache de service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      // Limpar cache storage
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      console.log('✓ Caches do navegador limpos');
      return true;
    } catch (error) {
      console.error('Erro ao limpar caches:', error);
      return false;
    }
  },

  // Validar e corrigir dados do localStorage
  validateAndFixLocalStorage: () => {
    const keys = [
      'cafe-connect-orders',
      'cafe-connect-order-counter',
      'cafe-connect-products',
      'cafe-connect-categories',
      'cafe-connect-inventory',
      'cafe-connect-users',
      'cafe-connect-tables',
      'cafe-connect-deliveries',
      'cafe-connect-payments',
      'cafe-connect-reports',
      'cafe-connect-config'
    ];

    let fixed = 0;
    let errors = 0;

    keys.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          // Tentar parsear para validar JSON
          JSON.parse(data);
        }
      } catch (error) {
        console.error(`Dados corrompidos em ${key}, removendo...`);
        localStorage.removeItem(key);
        fixed++;
        errors++;
      }
    });

    // Validar contador de pedidos
    try {
      const counter = localStorage.getItem('cafe-connect-order-counter');
      if (counter && isNaN(parseInt(counter))) {
        localStorage.setItem('cafe-connect-order-counter', '0');
        fixed++;
      }
    } catch (error) {
      localStorage.setItem('cafe-connect-order-counter', '0');
      fixed++;
    }

    console.log(`✓ LocalStorage validado: ${fixed} itens corrigidos, ${errors} erros encontrados`);
    return { fixed, errors };
  },

  // Limpar dados de sessão expirados
  clearExpiredSessions: () => {
    try {
      const sessionKey = 'cafe-connect-session';
      const session = localStorage.getItem(sessionKey);
      
      if (session) {
        const data = JSON.parse(session);
        const expiresAt = new Date(data.expiresAt);
        
        if (expiresAt < new Date()) {
          localStorage.removeItem(sessionKey);
          console.log('✓ Sessão expirada removida');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erro ao limpar sessões:', error);
      return false;
    }
  },

  // Limpar dados temporários
  clearTempData: () => {
    const tempKeys = Object.keys(localStorage).filter(key => 
      key.includes('temp-') || 
      key.includes('cache-') ||
      key.includes('draft-')
    );

    tempKeys.forEach(key => localStorage.removeItem(key));
    console.log(`✓ ${tempKeys.length} itens temporários removidos`);
    return tempKeys.length;
  },

  // Executar limpeza completa
  fullCleanup: async () => {
    console.log('🧹 Iniciando limpeza completa...');
    
    const results = {
      browserCaches: await cacheCleaner.clearBrowserCaches(),
      localStorage: cacheCleaner.validateAndFixLocalStorage(),
      sessions: cacheCleaner.clearExpiredSessions(),
      tempData: cacheCleaner.clearTempData()
    };

    console.log('✅ Limpeza completa finalizada:', results);
    return results;
  },

  // Resetar apenas dados de pedidos (mantém outros dados)
  resetOrdersOnly: () => {
    try {
      localStorage.removeItem('cafe-connect-orders');
      localStorage.setItem('cafe-connect-order-counter', '0');
      console.log('✓ Dados de pedidos resetados');
      return true;
    } catch (error) {
      console.error('Erro ao resetar pedidos:', error);
      return false;
    }
  }
};

// Executar validação automática ao carregar
if (typeof window !== 'undefined') {
  cacheCleaner.validateAndFixLocalStorage();
  cacheCleaner.clearExpiredSessions();
}
