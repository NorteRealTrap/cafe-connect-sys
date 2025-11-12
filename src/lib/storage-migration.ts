// Utilitário para migração e limpeza de storage

export const storageMigration = {
  forceCleanup: () => {
    const keys = [
      'cafe-connect-orders',
      'cafe-connect-order-counter',
      'ccpservices-web-orders',
      'cafe-orders',
      'cafe-orders-counter'
    ];
    
    keys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Erro ao limpar ${key}:`, error);
      }
    });
    
    console.log('✅ Storage limpo com sucesso');
  }
};
