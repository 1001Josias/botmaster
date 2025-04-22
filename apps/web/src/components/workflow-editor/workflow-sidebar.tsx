"use client"

import type React from "react"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, Search, Workflow, Database, Zap, Server } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface WorkflowSidebarProps {
  workers: any[]
  isLoading: boolean
}

export function WorkflowSidebar({ workers, isLoading }: WorkflowSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredWorkers = workers.filter((worker) => worker.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, worker: any) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(worker))
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <Card className="w-72 shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-2">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-2 p-1">
                  <h3 className="text-sm font-medium text-muted-foreground">Drag workers to the canvas</h3>

                  {isLoading ? (
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center gap-2 p-2">
                          <Skeleton className="h-8 w-8 rounded-md" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ))
                  ) : filteredWorkers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Bot className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-2 text-lg font-medium">No workers found</h3>
                      <p className="text-sm text-muted-foreground">Try adjusting your search term</p>
                    </div>
                  ) : (
                    filteredWorkers.map((worker) => (
                      <div
                        key={worker.id}
                        className="flex cursor-grab items-center gap-3 rounded-md border bg-card p-3 shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        draggable
                        onDragStart={(event) => onDragStart(event, worker)}
                      >
                        {getWorkerIcon(worker.type)}
                        <div>
                          <p className="text-sm font-medium">{worker.name}</p>
                          <p className="text-xs text-muted-foreground">{worker.description.substring(0, 30)}...</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="data" className="mt-2">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-2 p-1">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Skeleton className="h-8 w-8" />
                    </div>
                  ) : (
                    filteredWorkers
                      .filter((worker) => worker.type === "data")
                      .map((worker) => (
                        <div
                          key={worker.id}
                          className="flex cursor-grab items-center gap-3 rounded-md border bg-card p-3 shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                          draggable
                          onDragStart={(event) => onDragStart(event, worker)}
                        >
                          <Database className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium">{worker.name}</p>
                            <p className="text-xs text-muted-foreground">{worker.description.substring(0, 30)}...</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="process" className="mt-2">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-2 p-1">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Skeleton className="h-8 w-8" />
                    </div>
                  ) : (
                    filteredWorkers
                      .filter((worker) => worker.type === "process")
                      .map((worker) => (
                        <div
                          key={worker.id}
                          className="flex cursor-grab items-center gap-3 rounded-md border bg-card p-3 shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                          draggable
                          onDragStart={(event) => onDragStart(event, worker)}
                        >
                          <Workflow className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="text-sm font-medium">{worker.name}</p>
                            <p className="text-xs text-muted-foreground">{worker.description.substring(0, 30)}...</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="api" className="mt-2">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-2 p-1">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Skeleton className="h-8 w-8" />
                    </div>
                  ) : (
                    filteredWorkers
                      .filter((worker) => worker.type === "api")
                      .map((worker) => (
                        <div
                          key={worker.id}
                          className="flex cursor-grab items-center gap-3 rounded-md border bg-card p-3 shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                          draggable
                          onDragStart={(event) => onDragStart(event, worker)}
                        >
                          <Zap className="h-5 w-5 text-yellow-500" />
                          <div>
                            <p className="text-sm font-medium">{worker.name}</p>
                            <p className="text-xs text-muted-foreground">{worker.description.substring(0, 30)}...</p>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

function getWorkerIcon(type: string) {
  switch (type) {
    case "data":
      return <Database className="h-5 w-5 text-blue-500" />
    case "process":
      return <Workflow className="h-5 w-5 text-purple-500" />
    case "api":
      return <Zap className="h-5 w-5 text-yellow-500" />
    case "system":
      return <Server className="h-5 w-5 text-green-500" />
    default:
      return <Bot className="h-5 w-5 text-gray-500" />
  }
}

