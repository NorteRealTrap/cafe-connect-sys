// Script de reparo completo do sistema

export const systemRepair = {
  // Limpar todos os dados corrompidos
  clearAll: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cafe-') || key.startsWith('ccpservices-')) {
        localStorage.removeItem(key);
      }
    });
    console.log('✅ Todos os dados limpos');
  },

  // Inicializar bancos de dados vazios
  initializeDatabases: () => {
    const databases = {
      'cafe-connect-orders': [],
      'cafe-connect-order-counter': '0',
      'ccpservices-products': [],
      'ccpservices-categories': ['Bebidas', 'Lanches', 'Doces', 'Bar'],
      'ccpservices-inventory': [],
      'ccpservices-users': [],
      'ccpservices-tables': [],
      'ccpservices-web-orders': [],
      'ccpservices-payments': [],
      'ccpservices-deliveries': []
    };

    Object.entries(databases).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });

    console.log('✅ Bancos de dados inicializados');
  },

  // Criar produtos de exemplo
  createSampleProducts: () => {
    const products = [
      {
        id: 'prod_1',
        name: 'Café Expresso',
        description: 'Café expresso tradicional',
        price: 5.00,
        category: 'Bebidas',
        available: true,
        stock: 100
      },
      {
        id: 'prod_2',
        name: 'Pão de Queijo',
        description: 'Pão de queijo mineiro',
        price: 8.00,
        category: 'Lanches',
        available: true,
        stock: 50
      },
      {
        id: 'prod_3',
        name: 'Brownie',
        description: 'Brownie de chocolate',
        price: 12.00,
        category: 'Doces',
        available: true,
        stock: 30
      }
    ];

    localStorage.setItem('ccpservices-products', JSON.stringify(products));
    console.log('✅ Produtos de exemplo criados');
  },

  // Validar e corrigir dados existentes
  validateAndFix: () => {
    // Validar pedidos
    try {
      const orders = JSON.parse(localStorage.getItem('cafe-connect-orders') || '[]');
      if (!Array.isArray(orders)) {
        localStorage.setItem('cafe-connect-orders', '[]');
      }
    } catch {
      localStorage.setItem('cafe-connect-orders', '[]');
    }

    // Validar produtos
    try {
      const products = JSON.parse(localStorage.getItem('ccpservices-products') || '[]');
      if (!Array.isArray(products)) {
        localStorage.setItem('ccpservices-products', '[]');
      }
    } catch {
      localStorage.setItem('ccpservices-products', '[]');
    }

    console.log('✅ Dados validados e corrigidos');
  },

  // Reparo completo
  fullRepair: () => {
    console.log('🔧 Iniciando reparo completo...');
    systemRepair.clearAll();
    systemRepair.initializeDatabases();
    systemRepair.createSampleProducts();
    console.log('✅ Reparo completo finalizado!');
    return true;
  }
};

// Executar validação ao carregar
if (typeof window !== 'undefined') {
  systemRepair.validateAndFix();
}
