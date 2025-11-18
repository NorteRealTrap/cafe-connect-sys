import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Store, Bell, Shield, Palette, Database, Globe } from "lucide-react";
import { UserRole } from "@/components/auth/LoginForm";
import { DomainSettings } from "@/components/settings/DomainSettings";
import { CacheDiagnostics } from "@/components/debug/CacheDiagnostics";
import { SystemRepairPanel } from "@/components/debug/SystemRepairPanel";

interface ConfigPanelProps {
  onBack: () => void;
  userRole: UserRole;
}

export const ConfigPanel = ({ onBack }: ConfigPanelProps) => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [config, setConfig] = useState(() => {
    // Carrega configurações salvas do localStorage
    const saved = localStorage.getItem('pdv-config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar configurações:', e);
      }
    }
    
    // Configurações padrão
    return {
      storeName: "Café Connect",
      storeAddress: "Rua das Flores, 123",
      storePhone: "(11) 99999-9999",
      storeEmail: "contato@cafeconnect.com",
      currency: "BRL",
      timezone: "America/Sao_Paulo",
      notifications: true,
      autoBackup: true,
      darkMode: false,
      soundAlerts: true,
      printerEnabled: true,
      taxRate: 10,
      serviceCharge: 10,
      maxTables: 50,
      orderTimeout: 30
    };
  });

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (config.maxTables <= 0 || config.orderTimeout <= 0) {
      alert('Valores devem ser maiores que zero');
      return;
    }
    
    setSaveStatus('saving');
    localStorage.setItem('pdv-config', JSON.stringify(config));
    
    if (config.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
          <p className="text-muted-foreground">Gerencie as configurações do seu estabelecimento</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} variant="pdv" disabled={saveStatus === 'saving'}>
            {saveStatus === 'saving' ? 'Salvando...' : saveStatus === 'saved' ? 'Salvo!' : 'Salvar Alterações'}
          </Button>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="dominios">Domínios</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
          <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
          <TabsTrigger value="reparo">Reparo</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
        </TabsList>

        <TabsContent value="dominios" className="space-y-4">
          <DomainSettings />
        </TabsContent>

        <TabsContent value="diagnostico" className="space-y-4">
          <CacheDiagnostics />
        </TabsContent>

        <TabsContent value="reparo" className="space-y-4">
          <SystemRepairPanel />
        </TabsContent>

        <TabsContent value="geral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Estabelecimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nome do Estabelecimento</Label>
                  <Input
                    id="storeName"
                    value={config.storeName}
                    onChange={(e) => handleConfigChange("storeName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Telefone</Label>
                  <Input
                    id="storePhone"
                    value={config.storePhone}
                    onChange={(e) => handleConfigChange("storePhone", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeAddress">Endereço</Label>
                <Input
                  id="storeAddress"
                  value={config.storeAddress}
                  onChange={(e) => handleConfigChange("storeAddress", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>WhatsApp do Dono</CardTitle>
              <CardDescription>
                Número usado para receber relatórios de pedidos dos clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Número do WhatsApp (com DDD)</Label>
                <Input
                  id="ownerPhone"
                  placeholder="(11) 99999-9999"
                  value={config.ownerPhone || ''}
                  onChange={(e) => handleConfigChange("ownerPhone", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Exemplo: (11) 98765-4321 ou 11987654321
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sistema" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxTables">Número Máximo de Mesas</Label>
                  <Input
                    id="maxTables"
                    type="number"
                    min="1"
                    value={config.maxTables}
                    onChange={(e) => handleConfigChange("maxTables", Math.max(1, Number(e.target.value)))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderTimeout">Timeout de Pedidos (min)</Label>
                  <Input
                    id="orderTimeout"
                    type="number"
                    min="1"
                    value={config.orderTimeout}
                    onChange={(e) => handleConfigChange("orderTimeout", Math.max(1, Number(e.target.value)))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notificações Ativas</Label>
                <Switch
                  id="notifications"
                  checked={config.notifications}
                  onCheckedChange={(checked) => handleConfigChange("notifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="soundAlerts">Alertas Sonoros</Label>
                <Switch
                  id="soundAlerts"
                  checked={config.soundAlerts}
                  onCheckedChange={(checked) => handleConfigChange("soundAlerts", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Modo Escuro</Label>
                <Switch
                  id="darkMode"
                  checked={config.darkMode}
                  onCheckedChange={(checked) => handleConfigChange("darkMode", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};