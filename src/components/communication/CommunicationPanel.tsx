import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare, Instagram, Phone, Mail, Send, Settings } from "lucide-react";
import { MessagingSetup } from "./MessagingSetup";
import { credentialsManager } from "@/lib/multi-tenant-messaging";

interface CommunicationPanelProps {
  onBack: () => void;
}

interface Message {
  id: number;
  platform: "whatsapp" | "instagram" | "email" | "phone";
  customer: string;
  message: string;
  timestamp: string;
  status: "nova" | "respondida" | "pendente";
}

const mockMessages: Message[] = [
  {
    id: 1,
    platform: "whatsapp",
    customer: "João Silva",
    message: "Oi! Gostaria de fazer um pedido para delivery. Vocês entregam na Rua das Flores?",
    timestamp: "19:45",
    status: "nova"
  },
  {
    id: 2,
    platform: "instagram",
    customer: "maria_santos",
    message: "Adorei o hambúrguer de ontem! Vocês fazem festa de aniversário?",
    timestamp: "18:30",
    status: "pendente"
  },
  {
    id: 3,
    platform: "email",
    customer: "carlos@email.com",
    message: "Solicito informações sobre cardápio para evento corporativo de 50 pessoas.",
    timestamp: "17:15",
    status: "respondida"
  }
];

export const CommunicationPanel = ({ onBack }: CommunicationPanelProps) => {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const userId = localStorage.getItem('current-user-id') || 'default-user';
  const hasCredentials = credentialsManager.hasCredentials(userId);

  if (showSetup) {
    return <MessagingSetup userId={userId} onBack={() => setShowSetup(false)} />;
  }

  const getPlatformIcon = (platform: Message["platform"]) => {
    const icons = {
      whatsapp: <MessageSquare className="h-4 w-4" />,
      instagram: <Instagram className="h-4 w-4" />,
      email: <Mail className="h-4 w-4" />,
      phone: <Phone className="h-4 w-4" />
    };
    return icons[platform];
  };

  const getPlatformColor = (platform: Message["platform"]) => {
    const colors = {
      whatsapp: "bg-green-500",
      instagram: "bg-pink-500",
      email: "bg-blue-500",
      phone: "bg-gray-500"
    };
    return colors[platform];
  };

  const getStatusBadge = (status: Message["status"]) => {
    const variants = {
      nova: "destructive",
      pendente: "secondary",
      respondida: "default"
    } as const;

    const labels = {
      nova: "Nova",
      pendente: "Pendente",
      respondida: "Respondida"
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const handleReply = () => {
    if (!selectedMessage || !newMessage.trim()) return;

    setMessages(messages.map(msg => 
      msg.id === selectedMessage.id 
        ? { ...msg, status: "respondida" as const }
        : msg
    ));
    
    setNewMessage("");
    setSelectedMessage(null);
  };

  const markAsRead = (messageId: number) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: "pendente" as const }
        : msg
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Central de Comunicação</h1>
        </div>
        <Button variant="outline" onClick={() => setShowSetup(true)}>
          <Settings className="h-4 w-4 mr-2" />
          Configurar Canais
        </Button>
      </div>

      {!hasCredentials && (
        <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">Configure seus canais de comunicação</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Para enviar e receber mensagens, você precisa configurar suas credenciais do WhatsApp e Instagram.
                </p>
                <Button size="sm" className="mt-3" onClick={() => setShowSetup(true)}>
                  Configurar Agora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">WhatsApp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Mensagens hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Instagram</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">DMs pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Emails novos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Telefone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Chamadas perdidas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <h2 className="text-lg font-semibold">Mensagens Recentes</h2>
        {messages.map((message) => (
          <Card 
            key={message.id} 
            className={`hover:shadow-pdv transition-shadow cursor-pointer ${
              selectedMessage?.id === message.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedMessage(message)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-full text-white ${getPlatformColor(message.platform)}`}>
                    {getPlatformIcon(message.platform)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{message.customer}</span>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(message.status)}
                  {message.status === "nova" && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(message.id);
                      }}
                    >
                      Marcar como lida
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMessage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className={`p-2 rounded-full text-white ${getPlatformColor(selectedMessage.platform)}`}>
                {getPlatformIcon(selectedMessage.platform)}
              </div>
              Responder para {selectedMessage.customer}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">{selectedMessage.message}</p>
            </div>
            
            <Textarea
              placeholder="Digite sua resposta..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={4}
            />
            
            <div className="flex gap-2">
              <Button onClick={handleReply} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Enviar Resposta
              </Button>
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};