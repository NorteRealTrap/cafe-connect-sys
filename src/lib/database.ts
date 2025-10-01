export interface MenuItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  disponivel: boolean;
  destaque: boolean;
  imagem?: string;
  ingredientes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

class MenuDatabase {
  private storageKey = 'cafe-connect-menu-items';

  private getItems(): MenuItem[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const items = JSON.parse(stored);
        return items.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar itens do menu:', error);
    }
    return this.getDefaultItems();
  }

  private saveItems(items: MenuItem[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao salvar itens do menu:', error);
    }
  }

  private getDefaultItems(): MenuItem[] {
    const now = new Date();
    return [
      {
        id: "1",
        nome: "Hambúrguer Artesanal",
        descricao: "Pão brioche, carne 180g, queijo cheddar, alface, tomate",
        preco: 28.90,
        categoria: "lanchonete",
        disponivel: true,
        destaque: true,
        ingredientes: ["Pão brioche", "Carne bovina", "Queijo cheddar", "Alface", "Tomate"],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "2",
        nome: "Pizza Margherita",
        descricao: "Molho de tomate, mozzarella, manjericão fresco",
        preco: 42.90,
        categoria: "restaurante",
        disponivel: true,
        destaque: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "3",
        nome: "Bolo de Chocolate",
        descricao: "Bolo fofinho com cobertura de brigadeiro",
        preco: 8.50,
        categoria: "confeitaria",
        disponivel: true,
        destaque: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "4",
        nome: "Caipirinha",
        descricao: "Cachaça, limão, açúcar",
        preco: 12.90,
        categoria: "bar",
        disponivel: true,
        destaque: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "5",
        nome: "Sushi Combo",
        descricao: "10 peças variadas de sushi e sashimi",
        preco: 48.90,
        categoria: "japonesa",
        disponivel: true,
        destaque: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "6",
        nome: "Café Espresso",
        descricao: "Café especial torrado na casa",
        preco: 4.50,
        categoria: "cafeteria",
        disponivel: true,
        destaque: false,
        createdAt: now,
        updatedAt: now
      }
    ];
  }

  getAllItems(): MenuItem[] {
    return this.getItems();
  }

  addItem(item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): MenuItem {
    const items = this.getItems();
    const now = new Date();
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    
    items.unshift(newItem);
    this.saveItems(items);
    return newItem;
  }

  updateItem(id: string, updates: Partial<Omit<MenuItem, 'id' | 'createdAt'>>): MenuItem | null {
    const items = this.getItems();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveItems(items);
    return items[index];
  }

  deleteItem(id: string): boolean {
    const items = this.getItems();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) return false;
    
    this.saveItems(filteredItems);
    return true;
  }

  getItemsByCategory(category: string): MenuItem[] {
    const items = this.getItems();
    return category === 'todos' ? items : items.filter(item => item.categoria === category);
  }

  searchItems(query: string): MenuItem[] {
    const items = this.getItems();
    const lowerQuery = query.toLowerCase();
    return items.filter(item => 
      item.nome.toLowerCase().includes(lowerQuery) ||
      item.descricao.toLowerCase().includes(lowerQuery) ||
      (item.ingredientes && item.ingredientes.some(ing => ing.toLowerCase().includes(lowerQuery)))
    );
  }
}

export const menuDatabase = new MenuDatabase();