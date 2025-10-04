import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Instagram, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { credentialsManager, multiTenantWhatsApp, multiTenantInstagram, MessagingCredentials } from "@/lib/multi-tenant-messaging";

interface MessagingSetupProps {
  userId: string;
  onBack: () => void;
}

export const MessagingSetup = ({ userId, onBack }: MessagingSetupProps) => {
  const [credentials, setCredentials] = useState<MessagingCredentials | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [instagramStatus, setInstagramStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const [whatsappForm, setWhatsappForm] = useState({
    phoneNumberId: '',
    accessToken: '',
    businessAccountId: '',
    phoneNumber: ''
  });

  const [instagramForm, setInstagramForm] = useState({
    pageId: '',
    accessToken: '',
    username: ''
  });

  useEffect(() => {
    loadCredentials();
  }, [userId]);

  const loadCredentials = () => {
    const saved = credentialsManager.getCredentials(userId);
    if (saved) {
      setCredentials(saved);
      if (saved.whatsapp) {
        setWhatsappForm(saved.whatsapp);
        setWhatsappStatus('success');
      }
      if (saved.instagram) {
        setInstagramForm(saved.instagram);
        setInstagramStatus('success');
      }
    }
  };

  const saveWhatsApp = async () => {
    if (!whatsappForm.phoneNumberId || !whatsappForm.accessToken) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const saved = credentialsManager.saveCredentials(userId, {
      businessName: credentials?.businessName || 'Minha Empresa',
      whatsapp: whatsappForm,
      instagram: credentials?.instagram
    });

    setCredentials(saved);
    toast.success('Credenciais WhatsApp salvas!');
    testWhatsApp();
  };

  const saveInstagram = async () => {
    if (!instagramForm.pageId || !instagramForm.accessToken) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const saved = credentialsManager.saveCredentials(userId, {
      businessName: credentials?.businessName || 'Minha Empresa',
      whatsapp: credentials?.whatsapp,
      instagram: instagramForm
    });

    setCredentials(saved);
    toast.success('Credenciais Instagram salvas!');
    testInstagram();
  };

  const testWhatsApp = async () => {
    setWhatsappStatus('testing');
    try {
      const result = await multiTenantWhatsApp.testConnection(userId);
      if (result.success) {
        setWhatsappStatus('success');
        toast.success('WhatsApp conectado com sucesso!');
      } else {
        setWhatsappStatus('error');
        toast.error(result.error || 'Erro ao conectar WhatsApp');
      }
    } catch (error) {
      setWhatsappStatus('error');
      toast.error('Erro ao testar conexão WhatsApp');
    }
  };

  const testInstagram = async () => {
    setInstagramStatus('testing');
    try {
      const result = await multiTenantInstagram.testConnection(userId);
      if (result.success) {
        setInstagramStatus('success');
        toast.success('Instagram conectado com sucesso!');
      } else {
        setInstagramStatus('error');
        toast.error(result.error || 'Erro ao conectar Instagram');
      }
    } catch (error) {
      setInstagramStatus('error');
      toast.error('Erro ao testar conexão Instagram');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Conectado</Badge>;
      case 'error':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Erro</Badge>;
      case 'testing':
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Testando...</Badge>;
      default:
        return <Badge variant="outline">Não configurado</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configurar Canais de Comunicação</h2>
          <p className="text-muted-foreground">Configure suas credenciais do WhatsApp e Instagram</p>
        </div>
        <Button variant="outline" onClick={onBack}>Voltar</Button>
      </div>

      {/* WhatsApp Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <CardTitle>WhatsApp Business API</CardTitle>
            </div>
            {getStatusBadge(whatsappStatus)}
          </div>
          <CardDescription>
            Configure sua conta WhatsApp Business para enviar notificações automáticas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumberId">Phone Number ID *</Label>
              <Input
                id="phoneNumberId"
                placeholder="123456789012345"
                value={whatsappForm.phoneNumberId}
                onChange={(e) => setWhatsappForm({ ...whatsappForm, phoneNumberId: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappToken">Access Token *</Label>
              <Input
                id="whatsappToken"
                type="password"
                placeholder="EAAxxxxxxxxxx..."
                value={whatsappForm.accessToken}
                onChange={(e) => setWhatsappForm({ ...whatsappForm, accessToken: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAccountId">Business Account ID</Label>
              <Input
                id="businessAccountId"
                placeholder="123456789012345"
                value={whatsappForm.businessAccountId}
                onChange={(e) => setWhatsappForm({ ...whatsappForm, businessAccountId: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Número de Telefone</Label>
              <Input
                id="phoneNumber"
                placeholder="+55 11 99999-9999"
                value={whatsappForm.phoneNumber}
                onChange={(e) => setWhatsappForm({ ...whatsappForm, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveWhatsApp}>Salvar WhatsApp</Button>
            {credentials?.whatsapp && (
              <Button variant="outline" onClick={testWhatsApp}>Testar Conexão</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instagram Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-pink-500" />
              <CardTitle>Instagram Graph API</CardTitle>
            </div>
            {getStatusBadge(instagramStatus)}
          </div>
          <CardDescription>
            Configure sua conta Instagram Business para gerenciar mensagens diretas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="pageId">Instagram Page ID *</Label>
              <Input
                id="pageId"
                placeholder="123456789012345"
                value={instagramForm.pageId}
                onChange={(e) => setInstagramForm({ ...instagramForm, pageId: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramToken">Access Token *</Label>
              <Input
                id="instagramToken"
                type="password"
                placeholder="EAAxxxxxxxxxx..."
                value={instagramForm.accessToken}
                onChange={(e) => setInstagramForm({ ...instagramForm, accessToken: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username Instagram</Label>
              <Input
                id="username"
                placeholder="@meurestaurante"
                value={instagramForm.username}
                onChange={(e) => setInstagramForm({ ...instagramForm, username: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={saveInstagram}>Salvar Instagram</Button>
            {credentials?.instagram && (
              <Button variant="outline" onClick={testInstagram}>Testar Conexão</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <p className="font-medium">📚 Como obter as credenciais?</p>
            <p>Consulte o arquivo <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">GUIA_META_API.md</code> na raiz do projeto para instruções detalhadas.</p>
            <p className="text-muted-foreground">Você precisará criar um app no Meta for Developers e configurar WhatsApp Business API e/ou Instagram Graph API.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
