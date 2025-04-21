'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FoldersTree } from '@/components/folders/folders-tree'
import { FolderResources } from '@/components/folders/folder-resources'
import { FolderDetails } from '@/components/folders/folder-details'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ViewIcon as ViewGrid, List, FolderTree, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FoldersExplorer() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'tree' | 'grid' | 'list'>('tree')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar folders e recursos..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-muted rounded-md p-1 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className={cn('h-8 px-2', viewMode === 'tree' && 'bg-background shadow-sm')}
              onClick={() => setViewMode('tree')}
            >
              <FolderTree className="h-4 w-4 mr-2" />
              Árvore
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn('h-8 px-2', viewMode === 'grid' && 'bg-background shadow-sm')}
              onClick={() => setViewMode('grid')}
            >
              <ViewGrid className="h-4 w-4 mr-2" />
              Grade
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn('h-8 px-2', viewMode === 'list' && 'bg-background shadow-sm')}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            className={cn(showFilters && 'bg-accent')}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Status</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="all">Todos os status</option>
                <option value="active">Ativos</option>
                <option value="archived">Arquivados</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tipo de Recurso</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="all">Todos os tipos</option>
                <option value="workflow">Workflows</option>
                <option value="queue">Queues</option>
                <option value="worker">Workers</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Ordenar por</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="name">Nome</option>
                <option value="date">Data de modificação</option>
                <option value="resources">Número de recursos</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="folders" className="w-full">
                <div className="border-b">
                  <TabsList className="w-full rounded-none h-11">
                    <TabsTrigger value="folders" className="flex-1 rounded-none data-[state=active]:bg-background">
                      Folders
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="flex-1 rounded-none data-[state=active]:bg-background">
                      Favoritos
                    </TabsTrigger>
                    <TabsTrigger value="recent" className="flex-1 rounded-none data-[state=active]:bg-background">
                      Recentes
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="folders" className="m-0">
                  <div className="p-4">
                    <FoldersTree onSelectFolder={setSelectedFolder} selectedFolder={selectedFolder} />
                  </div>
                </TabsContent>

                <TabsContent value="favorites" className="m-0">
                  <div className="p-4">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="rounded-full bg-muted p-3 mb-3">
                        <FolderTree className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Nenhum favorito</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        Marque folders como favoritos para acessá-los rapidamente nesta seção.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recent" className="m-0">
                  <div className="p-4">
                    <div className="space-y-2">
                      {['Produção', 'Desenvolvimento', 'Workflows', 'Testes'].map((name, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer"
                          onClick={() => setSelectedFolder(`folder-${i}`)}
                        >
                          <FolderTree className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {i === 0 ? 'Agora' : i === 1 ? '5m atrás' : i === 2 ? '1h atrás' : '2h atrás'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedFolder ? (
            <>
              <FolderDetails folderId={selectedFolder} />
              <FolderResources folderId={selectedFolder} />
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FolderTree className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">Selecione um folder</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Selecione um folder na árvore à esquerda para visualizar seus detalhes e recursos.
                </p>
                <Button>Criar novo folder</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
