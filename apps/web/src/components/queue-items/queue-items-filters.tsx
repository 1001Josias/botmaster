'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, Filter, Search, X } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import type { QueueItemStatus } from '@/lib/types/queue-item'

export function QueueItemsFilters() {
  const [open, setOpen] = useState(false)
  const [dateFrom, setDateFrom] = useState<Date | undefined>()
  const [dateTo, setDateTo] = useState<Date | undefined>()
  const [status, setStatus] = useState<QueueItemStatus[]>([])
  const [worker, setWorker] = useState<string>('')
  const [job, setJob] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleApplyFilters = () => {
    const newFilters: string[] = []

    if (dateFrom) newFilters.push(`De: ${format(dateFrom, 'dd/MM/yyyy')}`)
    if (dateTo) newFilters.push(`Até: ${format(dateTo, 'dd/MM/yyyy')}`)
    if (status.length > 0) newFilters.push(`Status: ${status.length}`)
    if (worker) newFilters.push(`Worker: ${worker}`)
    if (job) newFilters.push(`Job: ${job}`)

    setActiveFilters(newFilters)
    setOpen(false)
  }

  const clearFilters = () => {
    setDateFrom(undefined)
    setDateTo(undefined)
    setStatus([])
    setWorker('')
    setJob('')
    setActiveFilters([])
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por ID, payload ou termo..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filtros Avançados</h4>
                  <p className="text-sm text-muted-foreground">Refine sua busca com filtros específicos</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1.5">
                      <Label htmlFor="date-from">Data Inicial</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date-from"
                            variant={'outline'}
                            className={cn('justify-start text-left font-normal', !dateFrom && 'text-muted-foreground')}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateFrom ? format(dateFrom, 'dd/MM/yyyy') : 'Selecionar'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="date-to">Data Final</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date-to"
                            variant={'outline'}
                            className={cn('justify-start text-left font-normal', !dateTo && 'text-muted-foreground')}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateTo ? format(dateTo, 'dd/MM/yyyy') : 'Selecionar'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione os status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waiting">Aguardando</SelectItem>
                        <SelectItem value="processing">Processando</SelectItem>
                        <SelectItem value="completed">Concluído</SelectItem>
                        <SelectItem value="error">Erro</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="worker">Worker</Label>
                    <Select value={worker} onValueChange={setWorker}>
                      <SelectTrigger id="worker">
                        <SelectValue placeholder="Selecione um worker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worker-1">Worker 1</SelectItem>
                        <SelectItem value="worker-2">Worker 2</SelectItem>
                        <SelectItem value="worker-3">Worker 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="job">Job</Label>
                    <Select value={job} onValueChange={setJob}>
                      <SelectTrigger id="job">
                        <SelectValue placeholder="Selecione um job" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="job-1">Job 1</SelectItem>
                        <SelectItem value="job-2">Job 2</SelectItem>
                        <SelectItem value="job-3">Job 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={clearFilters}>
                    Limpar
                  </Button>
                  <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {filter}
              <X className="h-3 w-3 cursor-pointer" />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearFilters}>
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  )
}
