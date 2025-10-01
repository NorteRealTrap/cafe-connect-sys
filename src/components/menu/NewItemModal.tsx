import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MenuItem } from "@/lib/database";

interface NewItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, 'id'>) => void;
}

export const NewItemModal = ({ open, onClose, onSave }: NewItemModalProps) => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: "",
    disponivel: true,
    destaque: false,
    ingredientes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.descricao || !formData.preco || !formData.categoria) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const newItem = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      categoria: formData.categoria,
      disponivel: formData.disponivel,
      destaque: formData.destaque,
      ingredientes: formData.ingredientes ? formData.ingredientes.split(",").map(i => i.trim()) : undefined
    };

    onSave(newItem);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      nome: "",
      descricao: "",
      preco: "",
      categoria: "",
      disponivel: true,
      destaque: false,
      ingredientes: ""
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Item do Cardápio</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome do produto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição do produto"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco">Preço *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                value={formData.preco}
                onChange={(e) => setFormData(prev => ({ ...prev, preco: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restaurante">Restaurante</SelectItem>
                  <SelectItem value="lanchonete">Lanchonete</SelectItem>
                  <SelectItem value="confeitaria">Confeitaria</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="japonesa">Japonesa</SelectItem>
                  <SelectItem value="cafeteria">Cafeteria</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ingredientes">Ingredientes (separados por vírgula)</Label>
            <Input
              id="ingredientes"
              value={formData.ingredientes}
              onChange={(e) => setFormData(prev => ({ ...prev, ingredientes: e.target.value }))}
              placeholder="Ingrediente 1, Ingrediente 2, ..."
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="disponivel"
                checked={formData.disponivel}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, disponivel: checked }))}
              />
              <Label htmlFor="disponivel">Disponível</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="destaque"
                checked={formData.destaque}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, destaque: checked }))}
              />
              <Label htmlFor="destaque">Destaque</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="pdv">
              Salvar Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};