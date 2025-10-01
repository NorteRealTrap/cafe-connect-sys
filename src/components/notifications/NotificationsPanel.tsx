import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ShoppingCart, Calendar, MessageCircle, CreditCard, Clock, X } from "lucide-react";

interface Notification {
  id: string;
  type: "pedido" | "reserva" | "mensagem" | "pagamento" | "status";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

interface NotificationsPanelProps {
  onClose: () => void;
}

export const NotificationsPanel = ({ onClose }: NotificationsPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "pedido",
      title: "Novo Pedido #045",
      message: "Mesa 12 - Hambúrguer Artesanal + Batata",
      time: "2 min",
      read: false,
      priority: "high"
    },
    {
      id: "2",
      type: "pagamento",
      title: "Pagamento Aprovado",
      message: "PIX R$ 67,80 - Mesa 8",
      time: "5 min",
      read: false,
      priority: "medium"
    },
    {
      id: "3",
      type: "reserva",
      title: "Nova Reserva",
      message: "Mesa 15 - 19:30 - 4 pessoas",
      time: "10 min",
      read: true,
      priority: "medium"
    },
    {
      id: "4",
      type: "status",
      title: "Pedido Pronto",
      message: "Pedido #042 - Mesa 5 pronto para entrega",
      time: "15 min",
      read: false,
      priority: "high"
    },
    {
      id: "5",
      type: "mensagem",
      title: "Mensagem WhatsApp",
      message: "Cliente pergunta sobre delivery",
      time: "20 min",
      read: true,
      priority: "low"
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case "pedido": return <ShoppingCart className="h-4 w-4" />;
      case "reserva": return <Calendar className="h-4 w-4" />;
      case "mensagem": return <MessageCircle className="h-4 w-4" />;
      case "pagamento": return <CreditCard className="h-4 w-4" />;
      case "status": return <Clock className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4">
      <Card className="w-96 max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notificações</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                  Marcar todas
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                  !notification.read ? "bg-blue-50/50" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPriorityColor(notification.priority)}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium ${!notification.read ? "font-semibold" : ""}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};