import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Truck, MapPin, Clock, Phone, User, Plus, Trash2 } from "lucide-react";
import { useRealtime } from "@/lib/realtime";
import { deliverySync } from "@/lib/delivery-sync";
import { toast } from "sonner";

interface DeliveryPanelProps {
  onBack: () => void;
}

interface DeliveryOrder {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: string[];
  total: number;
  status: "preparando" | "saiu_entrega" | "entregue" | "cancelado";
  driver?: string;
  estimatedTime: string;
  distance: string;
}

interface Driver {
  id: number;
  name: string;
  phone: string;
  vehicle: string;
  status: "disponivel" | "ocupado" | "offline";
  currentOrders: number;
}

const mockDeliveries: DeliveryOrder[] = [
  {
    id: "DEL-001",
    customer: "Ana Costa",
    phone: "(11) 99999-1234",
    address: "Rua das Flores, 123 - Centro",
    items: ["Pizza Margherita", "Refrigerante 2L"],
    total: 45.90,
    status: "saiu_entrega",
    driver: "Carlos",
    estimatedTime: "25 min",
    distance: "2.5 km"
  },
  {
    id: "DEL-002", 
    customer: "Roberto Silva",
    phone: "(11) 98888-5678",
    address: "Av. Principal, 456 - Jardim Europa",
    items: ["Hambúrguer Especial", "Batata Frita", "Coca-Cola"],
    total: 32.50,
    status: "preparando",
    estimatedTime: "35 min",
    distance: "4.2 km"
  },
  {
    id: "DEL-003",
    customer: "Maria Santos", 
    phone: "(11) 97777-9012",
    address: "Rua do Comércio, 789 - Vila Nova",
    items: ["Lasanha", "Salada", "Suco"],
    total: 28.90,
    status: "entregue",
    driver: "João",
    estimatedTime: "Entregue",
    distance: "1.8 km"
  }
];

const mockDrivers: Driver[] = [
  { id: 1, name: "Carlos Silva", phone: "(11) 99999-0001", vehicle: "Moto Honda", status: "ocupado", currentOrders: 1 },
  { id: 2, name: "João Santos", phone: "(11) 99999-0002", vehicle: "Bike Elétrica", status: "disponivel", currentOrders: 0 },
  { id: 3, name: "Pedro Lima", phone: "(11) 99999-0003", vehicle: "Moto Yamaha", status: "disponivel", currentOrders: 0 },
  { id: 4, name: "Ana Costa", phone: "(11) 99999-0004", vehicle: "Carro Fiat", status: "offline", currentOrders: 0 }
];

export const DeliveryPanel = ({ onBack }: DeliveryPanelProps) => {
  const [deliveries, setDeliveries] = useRealtime<DeliveryOrder[]>('ccpservices-deliveries', mockDeliveries);
  const [drivers, setDrivers] = useRealtime<Driver[]>('ccpservices-drivers', mockDrivers);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', phone: '', vehicle: '' });

  useEffect(() => {
    // Carregar deliveries do localStorage se existirem
    const storedDeliveries = JSON.parse(localStorage.getItem('ccpservices-deliveries') || '[]');
    if (storedDeliveries.length === 0) {
      setDeliveries(mockDeliveries);
    }
    
    const storedDrivers = JSON.parse(localStorage.getItem('ccpservices-drivers') || '[]');
    if (storedDrivers.length === 0) {
      setDrivers(mockDrivers);
    }
    
    // Escutar eventos de criação de delivery
    const handleDeliveryCreated = () => {
      const updated = JSON.parse(localStorage.getItem('ccpservices-deliveries') || '[]');
      setDeliveries(updated);
    };
    
    window.addEventListener('deliveryCreated', handleDeliveryCreated);
    window.addEventListener('orderStatusChanged', handleDeliveryCreated);
    
    // Atualizar status em tempo real
    const statusInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/status');
        const apiStatuses = await response.json();
        
        const currentDeliveries = JSON.parse(localStorage.getItem('ccpservices-deliveries') || '[]');
        let updated = false;
        
        const updatedDeliveries = currentDeliveries.map((delivery: any) => {
          const statusUpdate = apiStatuses.find((s: any) => s.orderId === delivery.orderId);
          if (statusUpdate) {
            const newStatus = statusUpdate.status === 'saiu-entrega' ? 'saiu_entrega' : 
                             statusUpdate.status === 'entregue' ? 'entregue' : delivery.status;
            if (newStatus !== delivery.status) {
              updated = true;
              return { ...delivery, status: newStatus };
            }
          }
          return delivery;
        });
        
        if (updated) {
          localStorage.setItem('ccpservices-deliveries', JSON.stringify(updatedDeliveries));
          setDeliveries(updatedDeliveries);
        }
      } catch (error) {
        console.log('Erro ao verificar status de delivery');
      }
    }, 2000);
    
    return () => {
      clearInterval(statusInterval);
      window.removeEventListener('deliveryCreated', handleDeliveryCreated);
      window.removeEventListener('orderStatusChanged', handleDeliveryCreated);
    };
  }, []);

  const getStatusBadge = (status: DeliveryOrder["status"]) => {
    const variants = {
      preparando: "secondary",
      saiu_entrega: "default", 
      entregue: "outline",
      cancelado: "destructive"
    } as const;

    const labels = {
      preparando: "Preparando",
      saiu_entrega: "Saiu para Entrega",
      entregue: "Entregue",
      cancelado: "Cancelado"
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getDriverStatusBadge = (status: Driver["status"]) => {
    const variants = {
      disponivel: "default",
      ocupado: "secondary",
      offline: "outline"
    } as const;

    const labels = {
      disponivel: "Disponível",
      ocupado: "Ocupado", 
      offline: "Offline"
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const assignDriver = async (orderId: string, driverId: number) => {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;

    const updatedDeliveries = deliveries.map(order => 
      order.id === orderId 
        ? { ...order, driver: driver.name, status: "saiu_entrega" as const }
        : order
    );
    setDeliveries(updatedDeliveries);
    
    const updatedDrivers = drivers.map(d =>
      d.id === driverId
        ? { ...d, status: "ocupado" as const, currentOrders: d.currentOrders + 1 }
        : d
    );
    setDrivers(updatedDrivers);
    
    deliverySync.updateDeliveryStatus(orderId, 'saiu_entrega', driver.name);
    
    const delivery = deliveries.find(d => d.id === orderId);
    if (delivery && (delivery as any).orderId) {
      try {
        await fetch('/api/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: (delivery as any).orderId,
            status: 'saiu-entrega',
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.log('Erro ao sincronizar status');
      }
    }
    
    toast.success(`Entregador ${driver.name} designado!`);
  };

  const completeDelivery = async (orderId: string) => {
    const order = deliveries.find(o => o.id === orderId);
    if (!order?.driver) return;

    const updatedDeliveries = deliveries.map(delivery => 
      delivery.id === orderId ? { ...delivery, status: "entregue" as const } : delivery
    );
    setDeliveries(updatedDeliveries);

    const updatedDrivers = drivers.map(driver =>
      driver.name === order.driver
        ? { 
            ...driver, 
            status: "disponivel" as const, 
            currentOrders: Math.max(0, driver.currentOrders - 1) 
          }
        : driver
    );
    setDrivers(updatedDrivers);
    
    // Sincronizar com sistema de delivery
    deliverySync.updateDeliveryStatus(orderId, 'entregue');
    
    // Sincronizar status via API
    if ((order as any).orderId) {
      try {
        await fetch('/api/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: (order as any).orderId,
            status: 'entregue',
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.log('Erro ao sincronizar status');
      }
    }
    
    toast.success('Entrega confirmada!');
  };

  const addDriver = () => {
    if (!newDriver.name || !newDriver.phone || !newDriver.vehicle) {
      toast.error('Preencha todos os campos');
      return;
    }

    const driver: Driver = {
      id: Date.now(),
      name: newDriver.name,
      phone: newDriver.phone,
      vehicle: newDriver.vehicle,
      status: 'disponivel',
      currentOrders: 0
    };

    const updatedDrivers = [...drivers, driver];
    setDrivers(updatedDrivers);
    setNewDriver({ name: '', phone: '', vehicle: '' });
    setShowAddDriver(false);
    toast.success('Entregador adicionado!');
  };

  const deleteDriver = (id: number) => {
    const driver = drivers.find(d => d.id === id);
    if (driver?.currentOrders > 0) {
      toast.error('Não é possível remover entregador com pedidos ativos');
      return;
    }

    const updatedDrivers = drivers.filter(d => d.id !== id);
    setDrivers(updatedDrivers);
    toast.success('Entregador removido!');
  };

  const availableDrivers = drivers.filter(d => d.status === "disponivel");

  const cancelDelivery = (orderId: string) => {
    const order = deliveries.find(o => o.id === orderId);
    if (!order) return;

    const updatedDeliveries = deliveries.map(delivery => 
      delivery.id === orderId ? { ...delivery, status: "cancelado" as const } : delivery
    );
    setDeliveries(updatedDeliveries);

    if (order.driver) {
      const updatedDrivers = drivers.map(driver =>
        driver.name === order.driver
          ? { ...driver, status: "disponivel" as const, currentOrders: Math.max(0, driver.currentOrders - 1) }
          : driver
      );
      setDrivers(updatedDrivers);
    }

    deliverySync.updateDeliveryStatus(orderId, 'cancelado');
    toast.success('Entrega cancelada!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Gestão de Delivery</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pedidos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deliveries.filter(d => d.status !== "entregue" && d.status !== "cancelado").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Entregadores Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableDrivers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Entregas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deliveries.filter(d => d.status === "entregue").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tempo Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 min</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Pedidos de Delivery</h2>
          {deliveries.map((order) => (
            <Card key={order.id} className="hover:shadow-pdv transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span className="font-medium">{order.customer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4" />
                      <span>{order.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>{order.address}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{order.estimatedTime} • {order.distance}</span>
                    </div>
                    {order.driver && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4" />
                        <span className="font-medium">{order.driver}</span>
                      </div>
                    )}
                    <div className="font-bold text-lg">
                      R$ {order.total.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="font-medium">Items:</span> {order.items.join(", ")}
                </div>
                
                <div className="flex gap-2 pt-2 flex-wrap">
                  {order.status === "preparando" && (
                    <>
                      {availableDrivers.length > 0 ? (
                        <select
                          className="px-3 py-1 border rounded text-sm"
                          onChange={(e) => assignDriver(order.id, Number(e.target.value))}
                          defaultValue=""
                        >
                          <option value="" disabled>Selecionar Entregador</option>
                          {availableDrivers.map(driver => (
                            <option key={driver.id} value={driver.id}>
                              {driver.name} - {driver.vehicle}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Badge variant="secondary">Sem entregadores disponíveis</Badge>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => cancelDelivery(order.id)}>
                        Cancelar
                      </Button>
                    </>
                  )}
                  {order.status === "saiu_entrega" && (
                    <>
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => completeDelivery(order.id)}
                      >
                        Confirmar Entrega
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => cancelDelivery(order.id)}>
                        Cancelar
                      </Button>
                    </>
                  )}
                  {order.status === "entregue" && (
                    <Badge variant="default" className="bg-green-600">Finalizado</Badge>
                  )}
                  {order.status === "cancelado" && (
                    <Badge variant="destructive">Cancelado</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Entregadores</h2>
            <Button size="sm" onClick={() => setShowAddDriver(!showAddDriver)}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>

          {showAddDriver && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Nome"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Telefone"
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Veículo"
                  value={newDriver.vehicle}
                  onChange={(e) => setNewDriver({ ...newDriver, vehicle: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={addDriver} className="flex-1">
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddDriver(false)} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {drivers.map((driver) => (
            <Card key={driver.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{driver.name}</span>
                  <div className="flex items-center gap-2">
                    {getDriverStatusBadge(driver.status)}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteDriver(driver.id)}
                      disabled={driver.currentOrders > 0}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>{driver.vehicle}</div>
                  <div>{driver.phone}</div>
                  {driver.currentOrders > 0 && (
                    <div className="text-primary font-medium">
                      {driver.currentOrders} pedido(s) ativo(s)
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};