import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Settings, Printer, Wifi, CreditCard, Bell, Users, Store } from "lucide-react";

interface SettingsPanelProps {
  onBack: () => void;
}

export const SettingsPanel = ({ onBack }: SettingsPanelProps) => {
  const [settings, setSettings] = useState({
    general: {
      storeName: "Meu Restaurante",
      address: "Rua Principal, 123",
      phone: "(11) 99999-9999",
      email: "contato@meurestaurante.com",
      autoBackup: true,
      notifications: true
    },
    printer: {
      kitchenPrinter: true,
      receiptPrinter: true,
      printerIP: "192.168.1.100",
      paperSize: "80mm"
    },
    payment: {
      acceptCash: true,
      acceptCard: true,
      acceptPix: true,
      serviceCharge: 10,
      autoCalculateTax: true
    },
    system: {
      darkMode: false,
      autoLogout: 30,
      soundAlerts: true,
      orderAlerts: true
    }
  });

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="printer">Impressoras</TabsTrigger>
          <TabsTrigger value="payment">Pagamentos</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Informações do Estabelecimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Nome do Estabelecimento</Label>
                  <Input
                    id="storeName"
                    value={settings.general.storeName}
                    onChange={(e) => updateSetting('general', 'storeName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={settings.general.phone}
                    onChange={(e) => updateSetting('general', 'phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.general.email}
                    onChange={(e) => updateSetting('general', 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={settings.general.address}
                    onChange={(e) => updateSetting('general', 'address', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações e Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoBackup">Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">Fazer backup dos dados diariamente</p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={settings.general.autoBackup}
                  onCheckedChange={(checked) => updateSetting('general', 'autoBackup', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações do sistema</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.general.notifications}
                  onCheckedChange={(checked) => updateSetting('general', 'notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="printer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Configurações de Impressora
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="kitchenPrinter">Impressora da Cozinha</Label>
                  <p className="text-sm text-muted-foreground">Imprimir pedidos para a cozinha</p>
                </div>
                <Switch
                  id="kitchenPrinter"
                  checked={settings.printer.kitchenPrinter}
                  onCheckedChange={(checked) => updateSetting('printer', 'kitchenPrinter', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="receiptPrinter">Impressora de Cupons</Label>
                  <p className="text-sm text-muted-foreground">Imprimir comprovantes para clientes</p>
                </div>
                <Switch
                  id="receiptPrinter"
                  checked={settings.printer.receiptPrinter}
                  onCheckedChange={(checked) => updateSetting('printer', 'receiptPrinter', checked)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="printerIP">IP da Impressora</Label>
                  <Input
                    id="printerIP"
                    value={settings.printer.printerIP}
                    onChange={(e) => updateSetting('printer', 'printerIP', e.target.value)}
                    placeholder="192.168.1.100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paperSize">Tamanho do Papel</Label>
                  <Input
                    id="paperSize"
                    value={settings.printer.paperSize}
                    onChange={(e) => updateSetting('printer', 'paperSize', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Métodos de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="acceptCash">Aceitar Dinheiro</Label>
                <Switch
                  id="acceptCash"
                  checked={settings.payment.acceptCash}
                  onCheckedChange={(checked) => updateSetting('payment', 'acceptCash', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="acceptCard">Aceitar Cartão</Label>
                <Switch
                  id="acceptCard"
                  checked={settings.payment.acceptCard}
                  onCheckedChange={(checked) => updateSetting('payment', 'acceptCard', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="acceptPix">Aceitar PIX</Label>
                <Switch
                  id="acceptPix"
                  checked={settings.payment.acceptPix}
                  onCheckedChange={(checked) => updateSetting('payment', 'acceptPix', checked)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceCharge">Taxa de Serviço (%)</Label>
                  <Input
                    id="serviceCharge"
                    type="number"
                    value={settings.payment.serviceCharge}
                    onChange={(e) => updateSetting('payment', 'serviceCharge', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoCalculateTax">Calcular Taxa Automaticamente</Label>
                  <p className="text-sm text-muted-foreground">Adicionar taxa de serviço aos pedidos</p>
                </div>
                <Switch
                  id="autoCalculateTax"
                  checked={settings.payment.autoCalculateTax}
                  onCheckedChange={(checked) => updateSetting('payment', 'autoCalculateTax', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Modo Escuro</Label>
                <Switch
                  id="darkMode"
                  checked={settings.system.darkMode}
                  onCheckedChange={(checked) => updateSetting('system', 'darkMode', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="soundAlerts">Alertas Sonoros</Label>
                <Switch
                  id="soundAlerts"
                  checked={settings.system.soundAlerts}
                  onCheckedChange={(checked) => updateSetting('system', 'soundAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="orderAlerts">Alertas de Pedidos</Label>
                <Switch
                  id="orderAlerts"
                  checked={settings.system.orderAlerts}
                  onCheckedChange={(checked) => updateSetting('system', 'orderAlerts', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="autoLogout">Logout Automático (minutos)</Label>
                <Input
                  id="autoLogout"
                  type="number"
                  value={settings.system.autoLogout}
                  onChange={(e) => updateSetting('system', 'autoLogout', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-4">
        <Button className="flex-1">
          Salvar Configurações
        </Button>
        <Button variant="outline">
          Restaurar Padrões
        </Button>
      </div>
    </div>
  );
};