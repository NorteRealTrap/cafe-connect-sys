import { useState, useEffect } from "react";
import { PDVLayout } from "@/components/PDVLayout";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
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
import { OperationsPanel } from "@/components/operations/OperationsPanel";
import { DatabaseStatusPanel } from "@/components/debug/DatabaseStatus";

import { UserRole } from "@/components/auth/LoginForm";

interface DashboardProps {
  userRole: UserRole;
  businessCategory?: any;
  onLogout: () => void;
}

interface DatabaseStatusPanelProps {
  onBack: () => void;
}

type ActiveModule = "dashboard" | "pedidos" | "cardapio" | "mesas" | "pagamentos" | "status" | "estoque" | "relatorios" | "comunicacao" | "categorias" | "delivery" | "operacoes" | "configuracoes" | "usuarios" | "debug";

export const Dashboard = ({ userRole: initialRole, businessCategory, onLogout }: DashboardProps) => {
  const [userRole, setUserRole] = useState<UserRole>(initialRole);

  // Sync internal role state when prop changes
  useEffect(() => {
    setUserRole(initialRole);
  }, [initialRole]);
  const [activeModule, setActiveModule] = useState<ActiveModule>(() => {
    const saved = localStorage.getItem('ccpservices-active-module');
    return (saved as ActiveModule) || "dashboard";
  });

  // Atalhos de teclado globais
  useKeyboardShortcuts([
    {
      key: 'h',
      ctrl: true,
      action: () => setActiveModule('dashboard'),
      description: 'Voltar ao Dashboard'
    },
    {
      key: 'p',
      ctrl: true,
      action: () => setActiveModule('pedidos'),
      description: 'Abrir Pedidos'
    },
    {
      key: 'm',
      ctrl: true,
      action: () => setActiveModule('cardapio'),
      description: 'Abrir Cardápio'
    },
    {
      key: 'Escape',
      action: () => setActiveModule('dashboard'),
      description: 'Voltar'
    },
    {
      key: 'F1',
      action: () => {},
      description: 'Ajuda'
    }
  ]);

  useEffect(() => {
    localStorage.setItem('ccpservices-active-module', activeModule);
  }, [activeModule]);

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId as ActiveModule);
  };

  const handleBackToDashboard = () => {
    setActiveModule("dashboard");
  };

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    const session = JSON.parse(localStorage.getItem('ccpservices-session') || '{}');
    session.role = newRole;
    localStorage.setItem('ccpservices-session', JSON.stringify(session));
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
      case "operacoes":
        return <OperationsPanel onBack={handleBackToDashboard} />;
      case "debug":
        return <DatabaseStatusPanel onBack={handleBackToDashboard} />;
      case "dashboard":
      default:
        return <DashboardGrid userRole={userRole} onModuleClick={handleModuleClick} />;
    }
  };

  return (
    <PDVLayout>
      <DashboardHeader userRole={userRole} onLogout={onLogout} onRoleChange={handleRoleChange} />
      {renderContent()}
    </PDVLayout>
  );
};