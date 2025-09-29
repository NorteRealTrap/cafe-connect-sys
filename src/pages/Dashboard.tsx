import { useState } from "react";
import { PDVLayout } from "@/components/PDVLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { OrdersPanel } from "@/components/orders/OrdersPanel";
import { MenuPanel } from "@/components/menu/MenuPanel";
import { UserRole } from "@/components/auth/LoginForm";

interface DashboardProps {
  userRole: UserRole;
  onLogout: () => void;
}

type ActiveModule = "dashboard" | "pedidos" | "cardapio" | "mesas" | "pagamentos" | "status" | "estoque" | "relatorios" | "comunicacao" | "categorias" | "delivery" | "operacoes" | "configuracoes";

export const Dashboard = ({ userRole, onLogout }: DashboardProps) => {
  const [activeModule, setActiveModule] = useState<ActiveModule>("dashboard");

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId as ActiveModule);
  };

  const handleBackToDashboard = () => {
    setActiveModule("dashboard");
  };

  const renderContent = () => {
    switch (activeModule) {
      case "pedidos":
        return <OrdersPanel onBack={handleBackToDashboard} />;
      case "cardapio":
        return <MenuPanel onBack={handleBackToDashboard} />;
      case "dashboard":
      default:
        return <DashboardGrid userRole={userRole} onModuleClick={handleModuleClick} />;
    }
  };

  return (
    <PDVLayout>
      <DashboardHeader userRole={userRole} onLogout={onLogout} />
      {renderContent()}
    </PDVLayout>
  );
};