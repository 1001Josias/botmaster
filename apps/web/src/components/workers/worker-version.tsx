'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { RotateCcw } from 'lucide-react'

interface WorkerVersionsProps {
  workerId: string
}

const mockVersions = [
  {
    id: 'v1.2.0',
    version: '1.2.0',
    createdAt: '2023-06-20T14:45:00Z',
    notes: 'Melhorias de performance e correção de bugs',
  },
  {
    id: 'v1.1.0',
    version: '1.1.0',
    createdAt: '2023-06-15T10:30:00Z',
    notes: 'Adicionado suporte para novos formatos de email',
  },
  {
    id: 'v1.0.0',
    version: '1.0.0',
    createdAt: '2023-05-15T10:30:00Z',
    notes: 'Versão inicial do worker',
  },
]

export function WorkerVersions({ workerId }: WorkerVersionsProps) {
  const [releasingVersion, setReleasingVersion] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  const handleRelease = (versionId: string) => {
    setReleasingVersion(versionId)
    // Lógica para fazer o release da versão selecionada
    console.log(`Fazendo release da versão ${versionId} do worker ${workerId}`)
    setTimeout(() => {
      setReleasingVersion(null)
      alert(`Release da versão ${versionId} concluído!`)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Versões</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Versão</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVersions.map((version) => (
              <TableRow key={version.id}>
                <TableCell className="font-medium">{version.version}</TableCell>
                <TableCell>{formatDate(version.createdAt)}</TableCell>
                <TableCell>{version.notes}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={releasingVersion === version.id}
                    onClick={() => handleRelease(version.id)}
                  >
                    {releasingVersion === version.id ? (
                      <>
                        <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                        Lançando...
                      </>
                    ) : (
                      'Fazer Release'
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
