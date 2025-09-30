import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Clock, CheckCircle } from "lucide-react";

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: "livre" | "ocupada" | "reservada" | "limpeza";
  customer?: string;
  orderTime?: string;
  orderTotal?: number;
}

interface TablesPanelProps {
  onBack: () => void;
}

export const TablesPanel = ({ onBack }: TablesPanelProps) => {
  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('pdv-tables');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar mesas:', e);
      }
    }
    
    return [
      { id: "1", number: 1, capacity: 2, status: "ocupada", customer: "João Silva", orderTime: "14:30", orderTotal: 45.90 },
      { id: "2", number: 2, capacity: 4, status: "livre" },
      { id: "3", number: 3, capacity: 6, status: "reservada", customer: "Maria Santos", orderTime: "15:00" },
      { id: "4", number: 4, capacity: 2, status: "limpeza" },
      { id: "5", number: 5, capacity: 4, status: "livre" },
      { id: "6", number: 6, capacity: 8, status: "ocupada", customer: "Carlos Lima", orderTime: "14:15", orderTotal: 120.50 }
    ];
  });

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

  const changeTableStatus = (tableId: string, newStatus: Table["status"]) => {
    const updatedTables = tables.map(table => 
      table.id === tableId ? { ...table, status: newStatus } : table
    );
    setTables(updatedTables);
    localStorage.setItem('pdv-tables', JSON.stringify(updatedTables));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Controle de Mesas</h2>
          <p className="text-muted-foreground">Gerencie o status e ocupação das mesas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="pdv">
            <Plus className="h-4 w-4" />
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
              {table.customer && (
                <div>
                  <p className="text-sm font-medium">Cliente: {table.customer}</p>
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
                      onClick={() => changeTableStatus(table.id, "ocupada")}
                    >
                      Ocupar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="warning"
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
                      variant="success"
                      onClick={() => changeTableStatus(table.id, "livre")}
                    >
                      Liberar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="info"
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
                    variant="success"
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
    </div>
  );
};