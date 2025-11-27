'use client'

import { useEstablishment } from '@/contexts/EstablishmentContext'
import { Check, ChevronsUpDown, Store, Coffee, Wine, Cake, Beer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'

const establishmentIcons = {
  BAKERY: Cake,
  COFFEE_SHOP: Coffee,
  BAR: Beer,
  WINE_SHOP: Wine,
  CONFECTIONERY: Cake,
}

const establishmentLabels = {
  BAKERY: 'Padaria',
  COFFEE_SHOP: 'Cafeteria',
  BAR: 'Bar',
  WINE_SHOP: 'Adega',
  CONFECTIONERY: 'Confeitaria',
}

export function EstablishmentSelector() {
  const { currentEstablishment, establishments, setCurrentEstablishment, isLoading } = useEstablishment()
  const [open, setOpen] = useState(false)

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="w-[280px] justify-between">
        <Store className="mr-2 h-4 w-4" />
        Carregando...
      </Button>
    )
  }

  if (!currentEstablishment) return null

  const Icon = establishmentIcons[currentEstablishment.type as keyof typeof establishmentIcons] || Store

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[280px] justify-between font-medium">
          <div className="flex items-center gap-2 overflow-hidden">
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{currentEstablishment.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Buscar estabelecimento..." />
          <CommandEmpty>Nenhum estabelecimento encontrado.</CommandEmpty>
          <CommandGroup>
            {establishments.map((establishment) => {
              const EstIcon = establishmentIcons[establishment.type as keyof typeof establishmentIcons] || Store
              const typeLabel = establishmentLabels[establishment.type as keyof typeof establishmentLabels] || establishment.type
              
              return (
                <CommandItem key={establishment.id} value={establishment.name} onSelect={() => { setCurrentEstablishment(establishment); setOpen(false) }} className="cursor-pointer">
                  <Check className={cn("mr-2 h-4 w-4", currentEstablishment.id === establishment.id ? "opacity-100" : "opacity-0")} />
                  <EstIcon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{establishment.name}</span>
                    <span className="text-xs text-muted-foreground">{typeLabel}</span>
                  </div>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
