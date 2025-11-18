import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Trash2, CheckCircle } from "lucide-react";
import { systemRepair } from "@/lib/system-repair";
import { toast } from "sonner";

export const SystemRepairPanel = () => {
  const handleFullRepair = () => {
    if (confirm('⚠️ Isso irá LIMPAR TODOS OS DADOS e reinicializar o sistema. Continuar?')) {
      systemRepair.fullRepair();
      toast.success('Sistema reparado! Recarregando...');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleValidate = () => {
    systemRepair.validateAndFix();
    toast.success('Dados validados e corrigidos!');
  };

  const handleCreateSamples = () => {
    systemRepair.createSampleProducts();
    toast.success('Produtos de exemplo criados!');
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Reparo do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Use estas ferramentas para corrigir problemas no sistema.
        </p>

        <div className="grid gap-2">
          <Button variant="outline" onClick={handleValidate} className="justify-start">
            <CheckCircle className="h-4 w-4 mr-2" />
            Validar e Corrigir Dados
          </Button>

          <Button variant="outline" onClick={handleCreateSamples} className="justify-start">
            <RefreshCw className="h-4 w-4 mr-2" />
            Criar Produtos de Exemplo
          </Button>

          <Button variant="destructive" onClick={handleFullRepair} className="justify-start">
            <Trash2 className="h-4 w-4 mr-2" />
            Reparo Completo (Limpa Tudo)
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
          <p><strong>Validar:</strong> Corrige dados corrompidos sem apagar</p>
          <p><strong>Produtos:</strong> Adiciona produtos de exemplo</p>
          <p><strong>Reparo Completo:</strong> Limpa tudo e reinicia do zero</p>
        </div>
      </CardContent>
    </Card>
  );
};
