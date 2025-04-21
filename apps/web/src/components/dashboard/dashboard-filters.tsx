"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, FolderTree, Bot, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export function DashboardFilters() {
  const [date, setDate] = useState<Date>()
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const clearFilters = () => {
    setDate(undefined)
    setSelectedFolder(null)
    setSelectedWorker(null)
    setSelectedStatus(null)
  }

  const hasFilters = date || selectedFolder || selectedWorker || selectedStatus

  return (
    <div className="bg-muted/40 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Calendar className="mr-2 h-3.5 w-3.5" />
              {date ? format(date, "PPP") : "Selecionar data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>

        <Select onValueChange={setSelectedFolder}>
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="Folder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os folders</SelectItem>
            <SelectItem value="production">Produção</SelectItem>
            <SelectItem value="development">Desenvolvimento</SelectItem>
            <SelectItem value="testing">Testes</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedWorker}>
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="Worker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os workers</SelectItem>
            <SelectItem value="email">Email Worker</SelectItem>
            <SelectItem value="notification">Notification Worker</SelectItem>
            <SelectItem value="processing">Processing Worker</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="running">Em andamento</SelectItem>
            <SelectItem value="success">Sucesso</SelectItem>
            <SelectItem value="failed">Falha</SelectItem>
            <SelectItem value="canceled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
            <X className="mr-2 h-3.5 w-3.5" />
            Limpar filtros
          </Button>
        )}

        <div className="flex flex-wrap gap-2">
          {date && (
            <Badge variant="secondary" className="rounded-sm">
              Data: {format(date, "dd/MM/yyyy")}
              <button className="ml-1 hover:text-destructive" onClick={() => setDate(undefined)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedFolder && (
            <Badge variant="secondary" className="rounded-sm">
              <FolderTree className="mr-1 h-3 w-3" />
              Folder: {selectedFolder === "all" ? "Todos" : selectedFolder}
              <button className="ml-1 hover:text-destructive" onClick={() => setSelectedFolder(null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedWorker && (
            <Badge variant="secondary" className="rounded-sm">
              <Bot className="mr-1 h-3 w-3" />
              Worker: {selectedWorker === "all" ? "Todos" : selectedWorker}
              <button className="ml-1 hover:text-destructive" onClick={() => setSelectedWorker(null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedStatus && (
            <Badge variant="secondary" className="rounded-sm">
              Status: {selectedStatus === "all" ? "Todos" : selectedStatus}
              <button className="ml-1 hover:text-destructive" onClick={() => setSelectedStatus(null)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

