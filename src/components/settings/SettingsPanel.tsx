import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Volume2, Smartphone, X } from "lucide-react";

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const [settings, setSettings] = useState({
    notifications: {
      pedidos: true,
      pagamentos: true,
      reservas: true,
      mensagens: false,
      status: true
    },
    sounds: {
      novoPedido: true,
      pagamentoAprovado: true,
      pedidoPronto: true,
      volume: true
    },
    display: {
      darkMode: false,
      compactView: false,
      autoRefresh: true
    }
  });

  const updateSetting = (category: string, key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Configurações</CardTitle>
            </div>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notifications" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="sounds">Sons</TabsTrigger>
              <TabsTrigger value="display">Exibição</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notificações
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pedidos">Novos Pedidos</Label>
                    <Switch
                      id="pedidos"
                      checked={settings.notifications.pedidos}
                      onCheckedChange={(checked) => updateSetting('notifications', 'pedidos', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pagamentos">Pagamentos</Label>
                    <Switch
                      id="pagamentos"
                      checked={settings.notifications.pagamentos}
                      onCheckedChange={(checked) => updateSetting('notifications', 'pagamentos', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="reservas">Reservas</Label>
                    <Switch
                      id="reservas"
                      checked={settings.notifications.reservas}
                      onCheckedChange={(checked) => updateSetting('notifications', 'reservas', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mensagens">Mensagens</Label>
                    <Switch
                      id="mensagens"
                      checked={settings.notifications.mensagens}
                      onCheckedChange={(checked) => updateSetting('notifications', 'mensagens', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">Status de Pedidos</Label>
                    <Switch
                      id="status"
                      checked={settings.notifications.status}
                      onCheckedChange={(checked) => updateSetting('notifications', 'status', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sounds" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Alertas Sonoros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="novoPedido">Novo Pedido</Label>
                    <Switch
                      id="novoPedido"
                      checked={settings.sounds.novoPedido}
                      onCheckedChange={(checked) => updateSetting('sounds', 'novoPedido', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pagamentoAprovado">Pagamento Aprovado</Label>
                    <Switch
                      id="pagamentoAprovado"
                      checked={settings.sounds.pagamentoAprovado}
                      onCheckedChange={(checked) => updateSetting('sounds', 'pagamentoAprovado', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pedidoPronto">Pedido Pronto</Label>
                    <Switch
                      id="pedidoPronto"
                      checked={settings.sounds.pedidoPronto}
                      onCheckedChange={(checked) => updateSetting('sounds', 'pedidoPronto', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="volume">Volume Ativo</Label>
                    <Switch
                      id="volume"
                      checked={settings.sounds.volume}
                      onCheckedChange={(checked) => updateSetting('sounds', 'volume', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="display" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Interface
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="darkMode">Modo Escuro</Label>
                    <Switch
                      id="darkMode"
                      checked={settings.display.darkMode}
                      onCheckedChange={(checked) => updateSetting('display', 'darkMode', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compactView">Visualização Compacta</Label>
                    <Switch
                      id="compactView"
                      checked={settings.display.compactView}
                      onCheckedChange={(checked) => updateSetting('display', 'compactView', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoRefresh">Atualização Automática</Label>
                    <Switch
                      id="autoRefresh"
                      checked={settings.display.autoRefresh}
                      onCheckedChange={(checked) => updateSetting('display', 'autoRefresh', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};