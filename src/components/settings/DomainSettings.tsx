import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Copy, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getCurrentTenant, addCustomDomain, removeCustomDomain, getTenantDomains } from '@/lib/tenant-resolver';

export const DomainSettings = () => {
  const tenant = getCurrentTenant();
  const [customDomain, setCustomDomain] = useState('');
  const [domains, setDomains] = useState<string[]>([]);
  
  const subdomain = `${tenant?.id || 'demo'}.cafeconnect.app`;
  const subdomainUrl = `https://${subdomain}`;

  useEffect(() => {
    if (tenant) {
      setDomains(getTenantDomains(tenant.id));
    }
  }, [tenant]);

  const handleAddDomain = () => {
    if (!customDomain.trim()) {
      toast.error('Digite um domínio válido');
      return;
    }

    if (!tenant) {
      toast.error('Tenant não identificado');
      return;
    }

    // Validar formato do domínio
    const domainRegex = /^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
    if (!domainRegex.test(customDomain)) {
      toast.error('Formato de domínio inválido');
      return;
    }

    addCustomDomain(customDomain.toLowerCase(), tenant.id);
    setDomains([...domains, customDomain.toLowerCase()]);
    setCustomDomain('');
    toast.success('Domínio adicionado! Configure o DNS conforme instruções.');
  };

  const handleRemoveDomain = (domain: string) => {
    if (confirm(`Remover domínio ${domain}?`)) {
      removeCustomDomain(domain);
      setDomains(domains.filter(d => d !== domain));
      toast.success('Domínio removido');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Configuração de Domínios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subdomínio Gratuito */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium">Seu Subdomínio (Gratuito)</label>
              <Badge variant="default">Ativo</Badge>
            </div>
            <div className="flex gap-2">
              <Input value={subdomainUrl} readOnly className="font-mono text-sm" />
              <Button variant="outline" onClick={() => copyToClipboard(subdomainUrl)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => window.open(subdomainUrl, '_blank')}>
                Abrir
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Este é seu link permanente e gratuito. Compartilhe com seus clientes!
            </p>
          </div>

          {/* Domínios Customizados */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium">Domínios Customizados</label>
              <Badge variant="secondary">{domains.length} configurado(s)</Badge>
            </div>
            
            {domains.length > 0 && (
              <div className="space-y-2 mb-4">
                {domains.map((domain) => (
                  <div key={domain} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-mono text-sm">{domain}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDomain(domain)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="meurestaurante.com.br"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
              />
              <Button onClick={handleAddDomain}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>

          {/* Instruções DNS */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-3 text-sm">
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    📋 Como configurar seu domínio customizado:
                  </p>
                  
                  <div className="space-y-2">
                    <p className="font-medium">1. Acesse o painel do seu domínio</p>
                    <p className="text-muted-foreground">
                      (Registro.br, GoDaddy, HostGator, etc)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">2. Adicione um registro CNAME:</p>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border font-mono text-xs space-y-1">
                      <div><strong>Tipo:</strong> CNAME</div>
                      <div><strong>Nome:</strong> @ ou www</div>
                      <div><strong>Valor:</strong> {subdomain}</div>
                      <div><strong>TTL:</strong> 3600</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">3. Aguarde a propagação</p>
                    <p className="text-muted-foreground">
                      Pode levar de 1 a 48 horas. Verifique em: dnschecker.org
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">4. SSL Automático</p>
                    <p className="text-muted-foreground">
                      O certificado HTTPS será gerado automaticamente pela Vercel
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Planos */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="font-medium">🚀 Quer domínios ilimitados?</p>
                <p className="text-sm text-muted-foreground">
                  Upgrade para o plano Pro e adicione quantos domínios quiser!
                </p>
                <Button variant="default" size="sm">
                  Ver Planos
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
