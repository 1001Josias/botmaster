'use client'

import { useState } from 'react'
import { Bot, Database, Folder, MoreHorizontal, PlusCircle, Workflow, Edit, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface Resource {
  id: string
  name: string
  type: 'workflow' | 'queue' | 'worker'
  description: string
  status: 'active' | 'inactive' | 'error'
}

// Dados de exemplo
const resources: Resource[] = [
  {
    id: '1',
    name: 'Processamento de Pedidos',
    type: 'workflow',
    description: 'Workflow para processamento automático de pedidos',
    status: 'active',
  },
  {
    id: '2',
    name: 'Fila de Emails',
    type: 'queue',
    description: 'Fila para envio de emails em massa',
    status: 'active',
  },
  {
    id: '3',
    name: 'Worker de Notificações',
    type: 'worker',
    description: 'Worker para processamento de notificações push',
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Integração ERP',
    type: 'workflow',
    description: 'Workflow para integração com sistema ERP',
    status: 'error',
  },
  {
    id: '5',
    name: 'Fila de Processamento',
    type: 'queue',
    description: 'Fila para processamento de dados em batch',
    status: 'active',
  },
]

export function FolderView() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredResources =
    activeTab === 'all' ? resources : resources.filter((resource) => resource.type === activeTab)

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'workflow':
        return <Workflow className="h-4 w-4" />
      case 'queue':
        return <Database className="h-4 w-4" />
      case 'worker':
        return <Bot className="h-4 w-4" />
      default:
        return <Folder className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ativo
          </Badge>
        )
      case 'inactive':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Inativo
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Erro
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Recursos</CardTitle>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Recurso
          </Button>
        </div>
        <CardDescription>Visualize e gerencie os recursos do folder selecionado</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="workflow">Workflows</TabsTrigger>
            <TabsTrigger value="queue">Queues</TabsTrigger>
            <TabsTrigger value="worker">Workers</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(resource.type)}
                        <CardTitle className="text-base">{resource.name}</CardTitle>
                      </div>
                      <CardDescription className="text-xs">{resource.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardFooter className="p-4 pt-2 flex justify-between">
                    {getStatusBadge(resource.status)}
                    <span className="text-xs text-muted-foreground">Atualizado há 2h</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
