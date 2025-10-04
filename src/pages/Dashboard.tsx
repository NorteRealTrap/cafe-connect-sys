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
import { WebOrdersPanel } from "@/components/web-orders/WebOrdersPanel";
import { DeliveryPanel } from "@/components/delivery/DeliveryPanel";
import { CommunicationPanel } from "@/components/communication/CommunicationPanel";

import { UserRole } from "@/components/auth/LoginForm";

interface DashboardProps {
  userRole: UserRole;
  businessCategory?: any;
  onLogout: () => void;
}

type ActiveModule = "dashboard" | "pedidos" | "cardapio" | "mesas" | "pagamentos" | "status" | "estoque" | "relatorios" | "comunicacao" | "categorias" | "delivery" | "operacoes" | "configuracoes" | "usuarios" | "debug";

export const Dashboard = ({ userRole, businessCategory, onLogout }: DashboardProps) => {
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
        return <WebOrdersPanel onBack={handleBackToDashboard} />;
      case "delivery":
        return <DeliveryPanel onBack={handleBackToDashboard} />;
      case "comunicacao":
        return <CommunicationPanel onBack={handleBackToDashboard} />;
      case "debug":
        return (
          <div className="p-6">
            <DatabaseStatus />
            <div className="mt-6">
              <button 
                onClick={handleBackToDashboard}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        );
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