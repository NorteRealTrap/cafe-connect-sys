import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Clock, CheckCircle, XCircle } from "lucide-react";

interface TablesPanel {
  onBack: () => void;
}

type TableStatus = "livre" | "ocupada" | "reservada" | "limpeza";

interface Table {
  id: number;
  number: number;
  capacity: number;
  status: TableStatus;
  guests?: number;
  waiter?: string;
  startTime?: string;
}

const mockTables: Table[] = [
  { id: 1, number: 1, capacity: 4, status: "ocupada", guests: 3, waiter: "João", startTime: "19:30" },
  { id: 2, number: 2, capacity: 2, status: "livre" },
  { id: 3, number: 3, capacity: 6, status: "reservada", guests: 4, startTime: "20:00" },
  { id: 4, number: 4, capacity: 4, status: "limpeza" },
  { id: 5, number: 5, capacity: 8, status: "ocupada", guests: 6, waiter: "Maria", startTime: "18:45" },
  { id: 6, number: 6, capacity: 2, status: "livre" },
];

export const TablesPanel = ({ onBack }: TablesPanel) => {
  const [tables, setTables] = useState<Table[]>(mockTables);

  const getStatusBadge = (status: TableStatus) => {
    const variants = {
      livre: "default",
      ocupada: "destructive", 
      reservada: "secondary",
      limpeza: "outline"
    } as const;
    
    const labels = {
      livre: "Livre",
      ocupada: "Ocupada",
      reservada: "Reservada", 
      limpeza: "Limpeza"
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const updateTableStatus = (tableId: number, newStatus: TableStatus) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, status: newStatus } : table
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Mesas & Comandos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <Card key={table.id} className="hover:shadow-pdv transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Mesa {table.number}</CardTitle>
                {getStatusBadge(table.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {table.guests ? `${table.guests}/${table.capacity}` : `Até ${table.capacity}`} pessoas
              </div>
              
              {table.waiter && (
                <div className="text-sm">
                  <span className="font-medium">Garçom:</span> {table.waiter}
                </div>
              )}
              
              {table.startTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  Desde {table.startTime}
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                {table.status === "livre" && (
                  <Button 
                    size="sm" 
                    onClick={() => updateTableStatus(table.id, "ocupada")}
                    className="flex-1"
                  >
                    Ocupar
                  </Button>
                )}
                {table.status === "ocupada" && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateTableStatus(table.id, "limpeza")}
                      className="flex-1"
                    >
                      Finalizar
                    </Button>
                  </>
                )}
                {table.status === "limpeza" && (
                  <Button 
                    size="sm" 
                    variant="success"
                    onClick={() => updateTableStatus(table.id, "livre")}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Liberar
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