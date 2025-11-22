import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const CacheDiagnostics = () => {
  const [cacheInfo, setCacheInfo] = useState(() => {
    const keys = Object.keys(localStorage);
    return keys.map(key => ({
      key,
      size: new Blob([localStorage.getItem(key) || '']).size,
      value: localStorage.getItem(key)
    }));
  });

  const refreshCache = () => {
    const keys = Object.keys(localStorage);
    setCacheInfo(keys.map(key => ({
      key,
      size: new Blob([localStorage.getItem(key) || '']).size,
      value: localStorage.getItem(key)
    })));
    toast.success('Cache atualizado');
  };

  const clearItem = (key: string) => {
    localStorage.removeItem(key);
    refreshCache();
    toast.success(`Item ${key} removido`);
  };

  const totalSize = cacheInfo.reduce((acc, item) => acc + item.size, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Diagnóstico de Cache</CardTitle>
          <Button variant="outline" size="sm" onClick={refreshCache}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Total: {cacheInfo.length} itens | Tamanho: {(totalSize / 1024).toFixed(2)} KB
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {cacheInfo.map((item) => (
            <div key={item.key} className="flex items-center justify-between p-2 border rounded">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.key}</p>
                <p className="text-xs text-muted-foreground">
                  {(item.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearItem(item.key)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
