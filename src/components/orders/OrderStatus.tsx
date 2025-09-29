import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Truck, Package } from "lucide-react";

export type OrderStatus = "aceito" | "preparando" | "pronto" | "entregue" | "retirado";

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
          icon: <CheckCircle className="h-3 w-3" />
        };
      case "preparando":
        return {
          label: "Preparando",
          variant: "default" as const,
          icon: <Clock className="h-3 w-3" />
        };
      case "pronto":
        return {
          label: type === "retirada" ? "Pronto p/ Retirada" : "Pronto",
          variant: "outline" as const,
          icon: <Package className="h-3 w-3" />
        };
      case "entregue":
        return {
          label: "Entregue",
          variant: "secondary" as const,
          icon: <Truck className="h-3 w-3" />
        };
      case "retirado":
        return {
          label: "Retirado",
          variant: "secondary" as const,
          icon: <CheckCircle className="h-3 w-3" />
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
};