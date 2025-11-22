import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Clock, CheckCircle, ShoppingCart } from "lucide-react";
import { TableOrderModal } from "./TableOrderModal";
import { toast } from "sonner";

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "livre" | "ocupada" | "reservada" | "limpeza";
  customer?: string;
  orderTime?: string;
  orderTotal?: number;
  orderItems?: any[];
}

interface TablesPanelProps {
  onBack: () => void;
}

const STORAGE_KEY = (() => {
  const key = process.env.REACT_APP_TABLES_STORAGE_KEY;
  if (!key) {
    console.warn('REACT_APP_TABLES_STORAGE_KEY não configurada');
    return `tables_${Date.now()}`;
  }
  return key;
})();

export const TablesPanel = ({ onBack }: TablesPanelProps) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTables(JSON.parse(saved));
      } else {
        // Criar mesas padrão
        const defaultTables = Array.from({ length: 10 }, (_, i) => ({
          id: `table_${i + 1}`,
          number: i + 1,
          capacity: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
          status: "livre" as const
        }));
        setTables(defaultTables);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTables));
      }
    } catch (error) {
      console.error('Erro ao carregar mesas:', error);
      setTables([]);
    }
  };

  const saveTables = (updatedTables: Table[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTables));
      setTables(updatedTables);
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  };

  const changeTableStatus = (tableId: string, newStatus: Table["status"]) => {
    const updatedTables = tables.map(table => {
      if (table.id === tableId) {
        if (newStatus === "livre") {
          return { ...table, status: newStatus, customer: undefined, orderTime: undefined, orderTotal: undefined, orderItems: undefined };
        }
        return { ...table, status: newStatus };
      }
      return table;
    });
    saveTables(updatedTables);
    toast.success('Status atualizado!');
  };

  const openOrderModal = (table: Table) => {
    setSelectedTable(table);
    setShowOrderModal(true);
  };

  const handleSaveOrder = (items: any[], total: number) => {
    if (!selectedTable) return;

    const updatedTables = tables.map(table => {
      if (table.id === selectedTable.id) {
        return {
          ...table,
          status: "ocupada" as const,
          orderItems: items,
          orderTotal: total,
          orderTime: table.orderTime || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return table;
    });

    saveTables(updatedTables);
    toast.success('Pedido salvo!');
    setShowOrderModal(false);
    setSelectedTable(null);
  };

  const addTable = () => {
    const newTable: Table = {
      id: `table_${Date.now()}`,
      number: tables.length + 1,
      capacity: 4,
      status: "livre"
    };
    saveTables([...tables, newTable]);
    toast.success('Mesa adicionada!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "livre": return "bg-green-100 text-green-800";
      case "ocupada": return "bg-red-100 text-red-800";
      case "reservada": return "bg-yellow-100 text-yellow-800";
      case "limpeza": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "livre": return <CheckCircle className="h-4 w-4" />;
      case "ocupada": return <Users className="h-4 w-4" />;
      case "reservada": return <Clock className="h-4 w-4" />;
      case "limpeza": return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Controle de Mesas</h2>
          <p className="text-muted-foreground">Total: {tables.length} mesas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="pdv" onClick={addTable}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Mesa
          </Button>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Card key={table.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Mesa {table.number}</CardTitle>
                <Badge className={`flex items-center gap-1 ${getStatusColor(table.status)}`}>
                  {getStatusIcon(table.status)}
                  {table.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Capacidade: {table.capacity} pessoas
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {table.orderItems && table.orderItems.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">{table.orderItems.length} itens</p>
                  {table.orderTime && (
                    <p className="text-sm text-muted-foreground">Desde: {table.orderTime}</p>
                  )}
                  {table.orderTotal && (
                    <p className="text-sm font-medium text-primary">
                      Total: R$ {table.orderTotal.toFixed(2)}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex flex-wrap gap-1">
                {table.status === "livre" && (
                  <>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => openOrderModal(table)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Fazer Pedido
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => changeTableStatus(table.id, "reservada")}
                    >
                      Reservar
                    </Button>
                  </>
                )}
                {table.status === "ocupada" && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openOrderModal(table)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Ver/Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => changeTableStatus(table.id, "livre")}
                    >
                      Liberar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => changeTableStatus(table.id, "limpeza")}
                    >
                      Limpeza
                    </Button>
                  </>
                )}
                {table.status === "reservada" && (
                  <>
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => changeTableStatus(table.id, "ocupada")}
                    >
                      Ocupar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => changeTableStatus(table.id, "livre")}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
                {table.status === "limpeza" && (
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => changeTableStatus(table.id, "livre")}
                  >
                    Finalizar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TableOrderModal
        open={showOrderModal}
        onClose={() => {
          setShowOrderModal(false);
          setSelectedTable(null);
        }}
        tableNumber={selectedTable?.number || 0}
        onSave={handleSaveOrder}
        currentItems={selectedTable?.orderItems}
      />
    </div>
  );
};
