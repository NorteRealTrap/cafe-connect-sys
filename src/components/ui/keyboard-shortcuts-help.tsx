import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";

interface KeyboardShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsHelp = ({ open, onClose }: KeyboardShortcutsHelpProps) => {
  const shortcuts = [
    { keys: ['Ctrl', 'H'], description: 'Voltar ao Dashboard' },
    { keys: ['Ctrl', 'P'], description: 'Abrir Pedidos' },
    { keys: ['Ctrl', 'M'], description: 'Abrir Cardápio' },
    { keys: ['Ctrl', 'N'], description: 'Novo Pedido' },
    { keys: ['Ctrl', 'K'], description: 'Buscar' },
    { keys: ['Ctrl', 'S'], description: 'Salvar' },
    { keys: ['Esc'], description: 'Fechar/Voltar' },
    { keys: ['F1'], description: 'Ajuda' },
    { keys: ['F5'], description: 'Atualizar' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Atalhos de Teclado
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, i) => (
                  <Badge key={i} variant="outline" className="font-mono">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
