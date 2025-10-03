import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Truck, Package } from "lucide-react";

export type OrderStatus = "aceito" | "preparando" | "pronto" | "saiu-entrega" | "entregue" | "retirado";

interface OrderStatusProps {
  status: OrderStatus;
  type?: "local" | "delivery" | "retirada";
}

export const OrderStatusBadge = ({ status, type = "local" }: OrderStatusProps) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "aceito":
        return {
          label: "Aceito",
          variant: "secondary" as const,
          icon: <CheckCircle className="h-3 w-3" />,
          className: "bg-blue-100 text-blue-800"
        };
      case "preparando":
        return {
          label: "Preparando",
          variant: "default" as const,
          icon: <Clock className="h-3 w-3" />,
          className: "bg-yellow-100 text-yellow-800"
        };
      case "pronto":
        return {
          label: type === "retirada" ? "Pronto p/ Retirada" : "Pronto",
          variant: "outline" as const,
          icon: <Package className="h-3 w-3" />,
          className: "bg-green-100 text-green-800"
        };
      case "saiu-entrega":
        return {
          label: "Saiu para Entrega",
          variant: "default" as const,
          icon: <Truck className="h-3 w-3" />,
          className: "bg-orange-100 text-orange-800"
        };
      case "entregue":
        return {
          label: "Entregue",
          variant: "secondary" as const,
          icon: <CheckCircle className="h-3 w-3" />,
          className: "bg-gray-100 text-gray-800"
        };
      case "retirado":
        return {
          label: "Retirado",
          variant: "secondary" as const,
          icon: <CheckCircle className="h-3 w-3" />,
          className: "bg-gray-100 text-gray-800"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
      {config.icon}
      {config.label}
    </Badge>
  );
};