import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Database, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/database";

export const SystemRepairPanel = () => {
  const handleRepairDatabase = () => {
    try {
      db.initializeDatabase();
      toast.success('Banco de dados reparado');
    } catch (error) {
      toast.error('Erro ao reparar banco de dados');
    }
  };

  const handleClearCache = () => {
    const confirmed = confirm('Isso irá limpar todo o cache. Continuar?');
    if (confirmed) {
      localStorage.clear();
      toast.success('Cache limpo');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleResetSystem = () => {
    const confirmed = confirm('⚠️ Isso irá resetar todo o sistema. Continuar?');
    if (confirmed) {
      localStorage.clear();
      db.initializeDatabase();
      toast.success('Sistema resetado');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Reparo do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button variant="outline" className="w-full" onClick={handleRepairDatabase}>
            <Database className="h-4 w-4 mr-2" />
            Reparar Banco de Dados
          </Button>
          
          <Button variant="outline" className="w-full" onClick={handleClearCache}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Limpar Cache
          </Button>
          
          <Button variant="destructive" className="w-full" onClick={handleResetSystem}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Resetar Sistema Completo
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Use estas ferramentas apenas se houver problemas no sistema
        </p>
      </CardContent>
    </Card>
  );
};
