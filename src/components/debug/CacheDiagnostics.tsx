import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Trash2, CheckCircle, AlertTriangle, Database } from "lucide-react";
import { cacheCleaner } from "@/lib/cache-cleaner";
import { toast } from "sonner";

export const CacheDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = () => {
    setIsRunning(true);
    
    const storageKeys = [
      'cafe-connect-orders',
      'cafe-connect-order-counter',
      'cafe-connect-products',
      'cafe-connect-categories',
      'cafe-connect-inventory',
      'cafe-connect-users',
      'cafe-connect-tables',
      'cafe-connect-deliveries',
      'cafe-connect-payments',
      'cafe-connect-reports',
      'cafe-connect-config'
    ];

    const results = storageKeys.map(key => {
      try {
        const data = localStorage.getItem(key);
        if (!data) return { key, status: 'empty', size: 0 };
        
        const parsed = JSON.parse(data);
        const size = new Blob([data]).size;
        
        return {
          key,
          status: 'ok',
          size,
          items: Array.isArray(parsed) ? parsed.length : 1
        };
      } catch (error) {
        return { key, status: 'corrupted', size: 0, error: String(error) };
      }
    });

    const totalSize = results.reduce((sum, r) => sum + r.size, 0);
    const corrupted = results.filter(r => r.status === 'corrupted').length;
    const empty = results.filter(r => r.status === 'empty').length;

    setDiagnostics({
      results,
      totalSize,
      corrupted,
      empty,
      timestamp: new Date()
    });

    setIsRunning(false);
    toast.success('Diagnóstico concluído');
  };

  const handleFullCleanup = async () => {
    if (!confirm('Isso irá limpar todos os caches. Deseja continuar?')) return;
    
    setIsRunning(true);
    await cacheCleaner.fullCleanup();
    toast.success('Cache limpo com sucesso!');
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleValidateOnly = () => {
    setIsRunning(true);
    const result = cacheCleaner.validateAndFixLocalStorage();
    setIsRunning(false);
    
    if (result.errors > 0) {
      toast.success(`${result.fixed} itens corrigidos`);
      runDiagnostics();
    } else {
      toast.success('Nenhum problema encontrado');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Diagnóstico de Cache
          </CardTitle>
          <CardDescription>
            Verifique e corrija problemas com dados armazenados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={runDiagnostics} 
              disabled={isRunning}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
              Executar Diagnóstico
            </Button>
            <Button 
              onClick={handleValidateOnly} 
              disabled={isRunning}
              variant="outline"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Validar e Corrigir
            </Button>
            <Button 
              onClick={handleFullCleanup} 
              disabled={isRunning}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Tudo
            </Button>
          </div>

          {diagnostics && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{formatBytes(diagnostics.totalSize)}</div>
                    <p className="text-xs text-muted-foreground">Tamanho Total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-destructive">{diagnostics.corrupted}</div>
                    <p className="text-xs text-muted-foreground">Corrompidos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-muted-foreground">{diagnostics.empty}</div>
                    <p className="text-xs text-muted-foreground">Vazios</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Detalhes por Banco de Dados</h4>
                {diagnostics.results.map((result: any) => (
                  <div key={result.key} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {result.status === 'ok' && <CheckCircle className="h-4 w-4 text-success" />}
                      {result.status === 'corrupted' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      {result.status === 'empty' && <Database className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-sm font-mono">{result.key.replace('cafe-connect-', '')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.items && (
                        <Badge variant="secondary">{result.items} itens</Badge>
                      )}
                      <Badge variant={result.status === 'ok' ? 'success' : result.status === 'corrupted' ? 'destructive' : 'secondary'}>
                        {result.status === 'ok' ? formatBytes(result.size) : result.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                Última verificação: {diagnostics.timestamp.toLocaleString('pt-BR')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
