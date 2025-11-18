import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, ArrowRight, ShoppingCart, Clock, CheckCircle, Truck } from 'lucide-react';

export const OrderTrackingInfo: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: 'Pedido Web Recebido',
      description: 'Cliente faz pedido via link público',
      icon: <Globe className="h-5 w-5" />,
      status: 'web-pendente',
      location: 'Módulo: Pedidos Web'
    },
    {
      id: 2,
      title: 'Pedido Aceito',
      description: 'Administrador aceita o pedido',
      icon: <CheckCircle className="h-5 w-5" />,
      status: 'aceito',
      location: 'Transferido para: Módulo Pedidos'
    },
    {
      id: 3,
      title: 'Em Preparação',
      description: 'Cozinha inicia o preparo',
      icon: <Clock className="h-5 w-5" />,
      status: 'preparando',
      location: 'Módulo: Pedidos → Status: Preparando'
    },
    {
      id: 4,
      title: 'Pedido Pronto',
      description: 'Pedido finalizado, aguardando entrega',
      icon: <ShoppingCart className="h-5 w-5" />,
      status: 'pronto',
      location: 'Módulo: Pedidos → Status: Pronto'
    },
    {
      id: 5,
      title: 'Entregue',
      description: 'Pedido entregue ao cliente',
      icon: <Truck className="h-5 w-5" />,
      status: 'entregue',
      location: 'Módulo: Pedidos → Histórico'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'web-pendente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'aceito': 'bg-blue-100 text-blue-800 border-blue-200',
      'preparando': 'bg-orange-100 text-orange-800 border-orange-200',
      'pronto': 'bg-green-100 text-green-800 border-green-200',
      'entregue': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo de Pedidos Web</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${getStatusColor(step.status)}`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {step.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {step.description}
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  📍 {step.location}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-400 mt-2" />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Como Acompanhar Pedidos:
          </h5>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• <strong>Pedidos Web:</strong> Aceitar/Rejeitar pedidos recebidos</li>
            <li>• <strong>Módulo Pedidos:</strong> Gerenciar preparo e entrega</li>
            <li>• <strong>Histórico:</strong> Ver pedidos finalizados</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};