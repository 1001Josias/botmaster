'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Play, Pause, RefreshCw, Trash2, Server, Clock, Repeat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorkerFormDialog } from './worker-form-dialog'
import { WorkerVersions } from './worker-version'
import { ExecuteWorkerDialog } from './execute-worker-dialog'

interface WorkerDetailsProps {
  id: string
}

export function WorkerDetails({ id }: WorkerDetailsProps) {
  const router = useRouter()
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [activeTab, setActiveTab] = useState('logs')
  const [openExecuteDialog, setOpenExecuteDialog] = useState(false)

  // Simulando a busca de dados do worker pelo ID
  const worker = {
    id: id,
    name: 'Email Worker',
    description: 'Processa e-mails da fila de entrada e envia notificações',
    type: 'email',
    status: 'active',
    folder: 'Produção',
    tasks: 1245,
    lastActive: '2 minutos atrás',
    concurrency: 5,
    timeout: 30,
    retries: 3,
    autoScale: true,
    minInstances: 1,
    maxInstances: 5,
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-06-20T14:45:00Z',
    version: '1.2.0',
    logs: [
      { timestamp: '2023-06-25T08:30:45Z', level: 'info', message: 'Worker iniciado com sucesso' },
      { timestamp: '2023-06-25T08:35:12Z', level: 'info', message: 'Processando lote de 50 e-mails' },
      { timestamp: '2023-06-25T08:36:30Z', level: 'warning', message: 'Tempo de processamento acima do esperado' },
      { timestamp: '2023-06-25T08:40:15Z', level: 'error', message: 'Falha ao conectar com servidor SMTP' },
      { timestamp: '2023-06-25T08:41:20Z', level: 'info', message: 'Reconectado ao servidor SMTP' },
      { timestamp: '2023-06-25T08:45:00Z', level: 'info', message: 'Processamento concluído com sucesso' },
    ],
    queues: [
      { id: 'Q-001', name: 'Email Queue', items: 45, processing: 5 },
      { id: 'Q-003', name: 'Notification Queue', items: 12, processing: 2 },
    ],
  }

  const workerVersions = ['latest', '1.0.0', '1.1.0', '1.2.0']

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Ativo
          </Badge>
        )
      case 'paused':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pausado
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

  const handleSaveWorker = (updatedWorker: any) => {
    console.log('Worker atualizado:', updatedWorker)
    // Aqui você implementaria a lógica para atualizar o worker no backend
  }

  const handleToggleStatus = () => {
    // Lógica para ativar/pausar o worker
    console.log('Alterando status do worker')
  }

  const handleRestart = () => {
    // Lógica para reiniciar o worker
    console.log('Reiniciando worker')
  }

  const handleExecute = (version: string, options: any, machines: string[]) => {
    // Lógica para executar o worker com as opções selecionadas
    console.log(`Executando worker ${id} na versão ${version} nas máquinas:`, machines, 'com opções:', options)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/workers')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{worker.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(worker.status)}
              <span className="text-sm text-muted-foreground">{worker.folder}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRestart}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reiniciar
          </Button>
          <Button variant="outline" onClick={handleToggleStatus}>
            {worker.status === 'active' ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Ativar
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setOpenExecuteDialog(true)}>
            <Play className="h-4 w-4 mr-2" />
            Executar
          </Button>
          <Button variant="outline" onClick={() => setOpenEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Descrição</h3>
            <p className="text-sm text-muted-foreground mt-1">{worker.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Timeout</span>
              </div>
              <span className="text-sm font-medium">{worker.timeout}s</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Concorrência</span>
              </div>
              <span className="text-sm font-medium">{worker.concurrency}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Repeat className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Retries</span>
              </div>
              <span className="text-sm font-medium">{worker.retries}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Auto Scaling</span>
              </div>
              <span className="text-sm font-medium">{worker.autoScale ? 'Sim' : 'Não'}</span>
            </div>

            {worker.autoScale && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm ml-6">Min. Instâncias</span>
                  </div>
                  <span className="text-sm font-medium">{worker.minInstances}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm ml-6">Max. Instâncias</span>
                  </div>
                  <span className="text-sm font-medium">{worker.maxInstances}</span>
                </div>
              </>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium">Criado em</h3>
            <p className="text-sm text-muted-foreground mt-1">{formatDate(worker.createdAt)}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="versions">Versões</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Logs Recentes</h3>
            <div className="space-y-4">
              {worker.logs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                  <div className="mt-0.5">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      INFO
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="mt-6">
          <WorkerVersions workerId={id} />
        </TabsContent>
      </Tabs>

      <WorkerFormDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        worker={worker}
        onSave={handleSaveWorker}
      />
      <ExecuteWorkerDialog
        open={openExecuteDialog}
        onOpenChange={setOpenExecuteDialog}
        workerId={id}
        workerVersions={workerVersions}
        onExecute={handleExecute}
      />
    </div>
  )
}
