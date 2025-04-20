"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { MoreVertical, FileText, RotateCcw, StopCircle, Bot, ArrowUpRight, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Dados de exemplo
const jobs = [
  {
    id: "JOB-001",
    name: "Processamento de Email #1245",
    worker: "Email Worker",
    status: "completed",
    duration: "1.2s",
    startedAt: "2023-03-15T14:30:00",
    completedAt: "2023-03-15T14:30:01",
    progress: 100,
  },
  {
    id: "JOB-002",
    name: "Envio de Notificação #458",
    worker: "Notification Worker",
    status: "running",
    duration: "0.8s",
    startedAt: "2023-03-15T14:31:00",
    completedAt: null,
    progress: 65,
  },
  {
    id: "JOB-003",
    name: "Geração de Relatório #89",
    worker: "Report Worker",
    status: "failed",
    duration: "3.5s",
    startedAt: "2023-03-15T14:29:00",
    completedAt: "2023-03-15T14:29:04",
    progress: 100,
  },
  {
    id: "JOB-004",
    name: "Processamento de Pagamento #567",
    worker: "Payment Worker",
    status: "pending",
    duration: "0s",
    startedAt: null,
    completedAt: null,
    progress: 0,
  },
  {
    id: "JOB-005",
    name: "Sincronização de Dados #234",
    worker: "Data Worker",
    status: "completed",
    duration: "4.2s",
    startedAt: "2023-03-15T14:25:00",
    completedAt: "2023-03-15T14:25:04",
    progress: 100,
  },
  {
    id: "JOB-006",
    name: "Processamento de Imagem #789",
    worker: "Media Worker",
    status: "running",
    duration: "5.1s",
    startedAt: "2023-03-15T14:28:00",
    completedAt: null,
    progress: 80,
  },
  {
    id: "JOB-007",
    name: "Envio de Email #1246",
    worker: "Email Worker",
    status: "completed",
    duration: "1.0s",
    startedAt: "2023-03-15T14:27:00",
    completedAt: "2023-03-15T14:27:01",
    progress: 100,
  },
]

export function JobsTable() {
  const [page, setPage] = useState(1)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Concluído
          </Badge>
        )
      case "running":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Em Execução
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Falha
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pendente
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progresso</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead>Iniciado em</TableHead>
              <TableHead>Concluído em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-mono text-xs">{job.id}</TableCell>
                <TableCell className="font-medium">{job.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <span>{job.worker}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(job.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={job.progress} className="w-[60px]" />
                    <span className="text-xs">{job.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>{job.duration}</span>
                  </div>
                </TableCell>
                <TableCell>{formatDate(job.startedAt)}</TableCell>
                <TableCell>{formatDate(job.completedAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
                    </Button>
                    {job.status === "running" && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <StopCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {job.status === "failed" && (
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                          Ver Worker
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}

