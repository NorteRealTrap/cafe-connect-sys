import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ShoppingCart, Utensils, Users } from "lucide-react";
import { useState } from "react";
import { NewOrderForm } from "@/components/orders/NewOrderForm";
import { NewItemModal } from "@/components/menu/NewItemModal";
import { ordersDatabase } from "@/lib/orders-database";

import { toast } from "sonner";

interface QuickActionsProps {
  onModuleClick: (moduleId: string) => void;
}

export const QuickActions = ({ onModuleClick }: QuickActionsProps) => {
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  const handleNewOrder = (orderData: any) => {
    try {
      const duplicate = ordersDatabase.checkDuplicateOrder(
        orderData.cliente,
        orderData.itens,
        5
      );

      if (duplicate) {
        toast.error(`Pedido similar já existe (#${duplicate.numero})`);
        return;
      }

      const newOrder = ordersDatabase.createOrder({
        tipo: orderData.tipo,
        mesa: orderData.mesa,
        endereco: orderData.endereco,
        cliente: orderData.cliente,
        telefone: orderData.telefone,
        itens: orderData.itens.map((item: any) => ({
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          nome: item.nome,
          quantidade: item.quantidade,
          preco: item.preco,
          observacoes: item.observacoes
        })),
        total: orderData.total,
        observacoes: orderData.observacoes
      });

      toast.success(`Pedido #${newOrder.numero} criado!`);
    } catch (error) {
      toast.error('Erro ao criar pedido');
    }
  };

  const handleNewItem = (itemData: any) => {
    try {
      const { menuDatabase } = require('@/lib/database');
      menuDatabase.addItem(itemData);
      toast.success('Item adicionado ao cardápio!');
    } catch (error) {
      toast.error('Erro ao adicionar item');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="default" 
            className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setShowNewOrderForm(true)}
          >
            <ShoppingCart className="h-4 w-4" />
            Novo Pedido
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => setShowNewItemModal(true)}
          >
            <Utensils className="h-4 w-4" />
            Novo Item
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => onModuleClick('pedidos')}
          >
            <Users className="h-4 w-4" />
            Ver Pedidos
          </Button>
        </CardContent>
      </Card>

      {showNewOrderForm && (
        <NewOrderForm 
          onClose={() => setShowNewOrderForm(false)}
          onSubmit={handleNewOrder}
        />
      )}
      
      {showNewItemModal && (
        <NewItemModal 
          onClose={() => setShowNewItemModal(false)}
          onSubmit={handleNewItem}
        />
      )}
    </>
  );
};