'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/Button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Building } from 'lucide-react'

type Tenant = {
  id: string
  name: string
  subdomain: string
}

// Exemplo de tenants
const tenants: Tenant[] = [
  {
    id: '1',
    name: 'Organização 1',
    subdomain: 'org1',
  },
  {
    id: '2',
    name: 'Organização 2',
    subdomain: 'org2',
  },
  {
    id: '3',
    name: 'Organização 3',
    subdomain: 'org3',
  },
]

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TenantSwitcherProps extends PopoverTriggerProps {}

export function TenantSwitcher({ className }: TenantSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [showNewTenantDialog, setShowNewTenantDialog] = React.useState(false)
  const [selectedTenant, setSelectedTenant] = React.useState<Tenant>(tenants[0] as Tenant)

  return (
    <Dialog open={showNewTenantDialog} onOpenChange={setShowNewTenantDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Selecione um tenant"
            className={cn('w-[200px] justify-between', className)}
          >
            <Building className="mr-2 h-4 w-4" />
            <span className="truncate">{selectedTenant.name}</span>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Buscar tenant..." />
              <CommandEmpty>Nenhum tenant encontrado.</CommandEmpty>
              <CommandGroup heading="Tenants">
                {tenants.map((tenant) => (
                  <CommandItem
                    key={tenant.id}
                    onSelect={() => {
                      setSelectedTenant(tenant)
                      setOpen(false)
                    }}
                    className="text-sm"
                  >
                    <Building className="mr-2 h-4 w-4" />
                    <span className="truncate">{tenant.name}</span>
                    <Check
                      className={cn('ml-auto h-4 w-4', selectedTenant.id === tenant.id ? 'opacity-100' : 'opacity-0')}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false)
                    setShowNewTenantDialog(true)
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Tenant
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo tenant</DialogTitle>
          <DialogDescription>Adicione um novo tenant à sua conta.</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do tenant</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomínio</Label>
              <div className="flex items-center gap-2">
                <Input id="subdomain" placeholder="acme" />
                <span>.botmaster.com</span>
              </div>
              <p className="text-sm text-muted-foreground">Este será o URL para acessar o tenant.</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTenantDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setShowNewTenantDialog(false)}>Continuar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
