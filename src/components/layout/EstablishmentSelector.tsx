'use client'

import { useEstablishment } from '@/contexts/EstablishmentContext'
import { Check, ChevronsUpDown, Store } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

const establishmentTypeLabels: Record<string, string> = {
  BAKERY: 'Padaria',
  COFFEE_SHOP: 'Cafeteria',
  BAR: 'Bar',
  WINE_SHOP: 'Adega',
  CONFECTIONERY: 'Confeitaria',
  RESTAURANT: 'Restaurante',
  OTHER: 'Outro'
}

export function EstablishmentSelector() {
  const { currentEstablishment, establishments, setCurrentEstablishment, isLoading } = useEstablishment()
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-[300px]">
        <Store className="mr-2 h-4 w-4" />
        Carregando...
      </Button>
    )
  }

  if (!establishments || establishments.length === 0) {
    return <div className="text-sm text-muted-foreground">Nenhum estabelecimento disponível</div>
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[320px] justify-between">
          <div className="flex items-center gap-2 truncate">
            <Store className="h-4 w-4 shrink-0" />
            <div className="flex flex-col items-start truncate">
              <span className="font-medium truncate">{currentEstablishment?.name || "Selecione um estabelecimento"}</span>
              {currentEstablishment && (
                <span className="text-xs text-muted-foreground">{establishmentTypeLabels[currentEstablishment.type] || currentEstablishment.type}</span>
              )}
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder="Buscar estabelecimento..." />
          <CommandEmpty>Nenhum estabelecimento encontrado.</CommandEmpty>
          <CommandGroup>
            {establishments.map((establishment) => (
              <CommandItem key={establishment.id} value={establishment.name} onSelect={() => { setCurrentEstablishment(establishment); setOpen(false) }} className="flex items-start gap-2 py-3">
                <Check className={cn("mt-1 h-4 w-4 shrink-0", currentEstablishment?.id === establishment.id ? "opacity-100" : "opacity-0")} />
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{establishment.name}</span>
                    <Badge variant="secondary" className="text-xs shrink-0">{establishmentTypeLabels[establishment.type] || establishment.type}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground truncate">{establishment.email}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
