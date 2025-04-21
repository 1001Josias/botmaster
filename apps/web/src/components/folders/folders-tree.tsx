"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  MoreHorizontal,
  PlusCircle,
  Edit,
  Trash2,
  Archive,
  Share2,
  Copy,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface FolderItem {
  id: string
  name: string
  type: "folder"
  status?: "active" | "archived"
  resourceCount: number
  children?: FolderItem[]
  expanded?: boolean
}

// Dados de exemplo
const initialFolders: FolderItem[] = [
  {
    id: 'folder-0',
    name: "Produção",
    type: "folder",
    status: "active",
    resourceCount: 32,
    expanded: true,
    children: [
      {
        id: 'folder-2',
        name: "Workflows",
        type: "folder",
        status: "active",
        resourceCount: 15,
        children: [
          {
            id: 'folder-5',
            name: "Processamento de Pedidos",
            type: "folder",
            status: "active",
            resourceCount: 8,
            children: [],
          },
          {
            id: 'folder-6',
            name: "Notificações",
            type: "folder",
            status: "active",
            resourceCount: 7,
            children: [],
          },
        ],
      },
      {
        id: 'folder-7',
        name: "Queues",
        type: "folder",
        status: "active",
        resourceCount: 10,
        children: [],
      },
      {
        id: 'folder-8',
        name: "Workers",
        type: "folder",
        status: "active",
        resourceCount: 7,
        children: [],
      },
    ],
  },
  {
    id: 'folder-1',
    name: "Desenvolvimento",
    type: "folder",
    status: "active",
    resourceCount: 45,
    children: [
      {
        id: 'folder-3',
        name: "Testes",
        type: "folder",
        status: "active",
        resourceCount: 20,
        children: [],
      },
      {
        id: 'folder-9',
        name: "Protótipos",
        type: "folder",
        status: "active",
        resourceCount: 25,
        children: [],
      },
    ],
  },
  {
    id: 'folder-4',
    name: "Arquivados",
    type: "folder",
    status: "archived",
    resourceCount: 10,
    children: [
      {
        id: 'folder-10',
        name: "Projetos Antigos",
        type: "folder",
        status: "archived",
        resourceCount: 10,
        children: [],
      },
    ],
  },
]

interface FolderStructureProps {
  onSelectFolder: (folderId: string | null) => void
  selectedFolder: string | null
}

export function FoldersTree({ onSelectFolder, selectedFolder }: FolderStructureProps) {
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders)
  const [searchTerm, setSearchTerm] = useState("")

  const toggleFolder = (folderId: string) => {
    const updateFolders = (items: FolderItem[]): FolderItem[] => {
      return items.map((item) => {
        if (item.id === folderId) {
          return { ...item, expanded: !item.expanded }
        }
        if (item.children) {
          return { ...item, children: updateFolders(item.children) }
        }
        return item
      })
    }

    setFolders(updateFolders(folders))
  }

  const renderFolderItem = (item: FolderItem, level = 0) => {
    const isExpanded = item.expanded
    const isSelected = selectedFolder === item.id

    return (
      <div key={item.id}>
        <div
          className={cn(
            "group flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-accent",
            level > 0 && "ml-4",
            isSelected && "bg-accent text-accent-foreground",
          )}
        >
          <div
            className="flex items-center gap-2 cursor-pointer flex-1"
            onClick={() => {
              toggleFolder(item.id)
              onSelectFolder(item.id)
            }}
          >
            <Button variant="ghost" size="icon" className="h-5 w-5">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-500" />
            ) : (
              <Folder
                className={cn("h-4 w-4", item.status === "archived" ? "text-muted-foreground" : "text-blue-500")}
              />
            )}
            <span className="text-sm">{item.name}</span>
            <Badge variant="outline" className="ml-2 text-xs">
              {item.resourceCount}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Subfolder
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                Adicionar aos Favoritos
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Renomear
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {item.status !== "archived" ? (
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  Arquivar
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Restaurar
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isExpanded && item.children && item.children.length > 0 && (
          <div className="mt-1">{item.children.map((child) => renderFolderItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <Input
          placeholder="Buscar folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8"
        />
      </div>
      <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
        {folders.map((folder) => renderFolderItem(folder))}
      </div>
    </div>
  )
}

