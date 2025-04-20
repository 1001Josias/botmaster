"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FoldersTree } from "@/components/folders/folders-tree"
import { FoldersGrid } from "@/components/folders/folders-grid"
import { FoldersResourcesTable } from "@/components/folders/folders-resources-table"

export function FoldersManagement() {
  const [activeTab, setActiveTab] = useState("tree")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Estrutura de Folders</CardTitle>
            <CardDescription>Visualize e gerencie a hierarquia de pastas</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tree" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tree">Árvore</TabsTrigger>
                <TabsTrigger value="grid">Grid</TabsTrigger>
              </TabsList>
              <div className="mt-4">
                <TabsContent value="tree" className="m-0">
                  <FoldersTree onSelectFolder={setSelectedFolder} selectedFolder={selectedFolder} />
                </TabsContent>
                <TabsContent value="grid" className="m-0">
                  <FoldersGrid onSelectFolder={setSelectedFolder} selectedFolder={selectedFolder} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <FoldersResourcesTable selectedFolder={selectedFolder} />
      </div>
    </div>
  )
}

