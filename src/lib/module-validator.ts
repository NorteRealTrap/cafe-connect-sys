// Validador de módulos do sistema

export const moduleValidator = {
  // Testar módulo de produtos
  testProducts: () => {
    try {
      const products = JSON.parse(localStorage.getItem('ccpservices-products') || '[]');
      return { ok: true, count: products.length };
    } catch {
      localStorage.setItem('ccpservices-products', '[]');
      return { ok: false, fixed: true };
    }
  },

  // Testar módulo de pedidos
  testOrders: () => {
    try {
      const orders = JSON.parse(localStorage.getItem('cafe-connect-orders') || '[]');
      return { ok: true, count: orders.length };
    } catch {
      localStorage.setItem('cafe-connect-orders', '[]');
      return { ok: false, fixed: true };
    }
  },

  // Testar módulo de inventário
  testInventory: () => {
    try {
      const inventory = JSON.parse(localStorage.getItem('ccpservices-inventory') || '[]');
      return { ok: true, count: inventory.length };
    } catch {
      localStorage.setItem('ccpservices-inventory', '[]');
      return { ok: false, fixed: true };
    }
  },

  // Executar todos os testes
  runAll: () => {
    const results = {
      products: moduleValidator.testProducts(),
      orders: moduleValidator.testOrders(),
      inventory: moduleValidator.testInventory()
    };
    
    console.log('📊 Resultados da validação:', results);
    return results;
  }
};
