import { useState } from "react";
import { PDVLayout } from "@/components/PDVLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { OrdersPanel } from "@/components/orders/OrdersPanel";
import { MenuPanel } from "@/components/menu/MenuPanel";
import { ConfigPanel } from "@/components/config/ConfigPanel";
import { UsersPanel } from "@/components/users/UsersPanel";
import { TablesPanel } from "@/components/tables/TablesPanel";
import { PaymentsPanel } from "@/components/payments/PaymentsPanel";
import { ReportsPanel } from "@/components/reports/ReportsPanel";
import { CategoriesPanel } from "@/components/categories/CategoriesPanel";
import { InventoryPanel } from "@/components/inventory/InventoryPanel";
import { StatusPanel } from "@/components/status/StatusPanel";
import { UserRole } from "@/components/auth/LoginForm";

interface DashboardProps {
  userRole: UserRole;
  onLogout: () => void;
}

type ActiveModule = "dashboard" | "pedidos" | "cardapio" | "mesas" | "pagamentos" | "status" | "estoque" | "relatorios" | "comunicacao" | "categorias" | "delivery" | "operacoes" | "configuracoes" | "usuarios";

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
      case "configuracoes":
        return <ConfigPanel onBack={handleBackToDashboard} userRole={userRole} />;
      case "usuarios":
        return <UsersPanel onBack={handleBackToDashboard} />;
      case "mesas":
        return <TablesPanel onBack={handleBackToDashboard} />;
      case "pagamentos":
        return <PaymentsPanel onBack={handleBackToDashboard} />;
      case "relatorios":
        return <ReportsPanel onBack={handleBackToDashboard} />;
      case "categorias":
        return <CategoriesPanel onBack={handleBackToDashboard} />;
      case "estoque":
        return <InventoryPanel onBack={handleBackToDashboard} />;
      case "status":
        return <StatusPanel onBack={handleBackToDashboard} />;
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