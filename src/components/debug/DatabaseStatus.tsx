import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Download, Upload, RefreshCw, Trash2, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { databaseManager, DatabaseStatus } from "@/lib/database-manager";
import { toast } from "sonner";

interface DatabaseStatusPanelProps {
  onBack: () => void;
}

export const DatabaseStatusPanel = ({ onBack }: DatabaseStatusPanelProps) => {
  const [stats, setStats] = useState(databaseManager.getStats());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setStats(databaseManager.getStats());
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = () => {
    setStats(databaseManager.getStats());
    toast.success('Status atualizado');
  };

  const handleBackup = () => {
    const backup = databaseManager.backupAll();
    const blob = new Blob([backup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Backup realizado com sucesso');
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const backup = event.target?.result as string;
        if (databaseManager.restoreBackup(backup)) {
          toast.success('Backup restaurado com sucesso');
          handleRefresh();
        } else {
          toast.error('Erro ao restaurar backup');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearAll = () => {
    if (confirm('⚠️ ATENÇÃO: Isso irá apagar TODOS os dados! Deseja continuar?')) {
      databaseManager.clearAllDatabases();
      databaseManager.initializeAllDatabases();
      toast.success('Todos os bancos foram limpos e reinicializados');
      handleRefresh();
    }
  };

  const getStatusIcon = (status: DatabaseStatus['status']) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: DatabaseStatus['status']) => {
    switch (status) {
      case 'ok':
        return <Badge variant="default" className="bg-green-500">OK</Badge>;
      case 'warning':
        return <Badge variant="secondary">Aviso</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6" />
            Status dos Bancos de Dados
          </h2>
          <p className="text-muted-foreground">Monitoramento em tempo real</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>Voltar</Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total de Bancos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Inicializados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.initialized}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total de Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRecords}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Saudáveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.healthy}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Problemas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.warnings + stats.errors}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button onClick={handleBackup}>
            <Download className="h-4 w-4 mr-2" />
            Fazer Backup
          </Button>
          <Button variant="outline" onClick={handleRestore}>
            <Upload className="h-4 w-4 mr-2" />
            Restaurar Backup
          </Button>
          <Button variant="destructive" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Tudo
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Bancos */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes dos Bancos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.databases.map((db) => (
              <div
                key={db.key}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(db.status)}
                  <div>
                    <div className="font-medium">{db.name}</div>
                    <div className="text-sm text-muted-foreground">{db.key}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{db.recordCount} registros</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(db.lastSync).toLocaleTimeString('pt-BR')}
                    </div>
                  </div>
                  {getStatusBadge(db.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
