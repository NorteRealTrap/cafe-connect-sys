import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatabaseIntegration } from "@/lib/database-integration";
import { Database, CheckCircle, XCircle, RefreshCw, Trash2 } from "lucide-react";

export const DatabaseStatus = () => {
  const [status, setStatus] = useState<any>({});
  const [integrity, setIntegrity] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = () => {
    setLoading(true);
    try {
      const systemStatus = DatabaseIntegration.syncAllSystems();
      const dataIntegrity = DatabaseIntegration.validateDataIntegrity();
      
      setStatus(systemStatus);
      setIntegrity(dataIntegrity);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSampleData = () => {
    setLoading(true);
    try {
      const result = DatabaseIntegration.initializeSampleData();
      if (result.success) {
        alert('Dados de exemplo inicializados com sucesso!');
        checkStatus();
      } else {
        alert('Erro ao inicializar dados: ' + result.message);
      }
    } catch (error) {
      alert('Erro ao inicializar dados');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Status dos Bancos de Dados</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={checkStatus} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button variant="success" onClick={initializeSampleData} disabled={loading}>
            Inicializar Dados
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status.status === 'operational' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            Status dos Sistemas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{status.menu || 0}</div>
              <div className="text-sm text-muted-foreground">Itens do Menu</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{status.payments || 0}</div>
              <div className="text-sm text-muted-foreground">Pagamentos</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{status.transactions || 0}</div>
              <div className="text-sm text-muted-foreground">Transações</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{status.reports || 0}</div>
              <div className="text-sm text-muted-foreground">Relatórios</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {integrity.valid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            Integridade dos Dados
            <Badge variant={integrity.valid ? "default" : "destructive"}>
              {integrity.valid ? "Válido" : "Problemas Encontrados"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {integrity.issues && integrity.issues.length > 0 && (
            <div className="space-y-2 mb-4">
              <h4 className="font-semibold text-red-600">Problemas Encontrados:</h4>
              <ul className="list-disc list-inside space-y-1">
                {integrity.issues.map((issue: string, index: number) => (
                  <li key={index} className="text-sm text-red-600">{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {integrity.stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Categorias do Menu:</h4>
                <div className="flex flex-wrap gap-1">
                  {integrity.stats.categories?.menu?.map((cat: string) => (
                    <Badge key={cat} variant="outline">{cat}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Categorias nas Transações:</h4>
                <div className="flex flex-wrap gap-1">
                  {integrity.stats.categories?.transactions?.map((cat: string) => (
                    <Badge key={cat} variant="secondary">{cat}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};