export interface ProcessNode {
  id: string
  type: string
  position: { x: number; y: number }
  data: {
    label: string
    type: string
    properties?: Record<string, any>
    implementation?: {
      resourceType?: string
      resourceId?: string
      configuration?: Record<string, any>
    }
  }
}

export interface ProcessEdge {
  id: string
  source: string
  target: string
  type?: string
  label?: string
  animated?: boolean
  style?: Record<string, any>
}

export interface Process {
  id: string
  name: string
  description: string
  status: "draft" | "pending" | "active" | "completed"
  version: string
  nodes: ProcessNode[]
  edges: ProcessEdge[]
  createdAt: string
  updatedAt: string
  createdBy: string
  lastUpdatedBy: string
}

export interface ProcessVersion {
  id: string
  processId: string
  version: string
  nodes: ProcessNode[]
  edges: ProcessEdge[]
  createdAt: string
  createdBy: string
  notes?: string
}

export interface ProcessExecution {
  id: string
  processId: string
  version: string
  status: "running" | "completed" | "failed" | "cancelled"
  startedAt: string
  completedAt?: string
  currentNodeId?: string
  executedNodes: {
    nodeId: string
    startedAt: string
    completedAt?: string
    status: "completed" | "failed" | "skipped"
    output?: any
  }[]
  input?: any
  output?: any
  logs: {
    timestamp: string
    nodeId?: string
    message: string
    level: "info" | "warning" | "error"
    data?: any
  }[]
}

