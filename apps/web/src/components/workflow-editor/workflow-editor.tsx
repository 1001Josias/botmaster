'use client'

import type React from 'react'

import { useState, useCallback, useRef, useEffect } from 'react'
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
  ConnectionLineType,
  Panel,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { WorkflowHeader } from './workflow-header'
import { WorkflowSidebar } from './workflow-sidebar'
import { WorkerNode } from './nodes/worker-node'
import { StartNode } from './nodes/start-node'
import { EndNode } from './nodes/end-node'
import { fetchWorkers } from '@/lib/api/workers'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Save, Play, FileJson } from 'lucide-react'

// Define node types
const nodeTypes: NodeTypes = {
  workerNode: WorkerNode,
  startNode: StartNode,
  endNode: EndNode,
}

// Initial nodes for a new workflow
const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'startNode',
    position: { x: 250, y: 5 },
    data: { label: 'Start' },
  },
  {
    id: 'end',
    type: 'endNode',
    position: { x: 250, y: 400 },
    data: { label: 'End' },
  },
]

export function WorkflowEditor() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [workers, setWorkers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [workflowName, setWorkflowName] = useState('New Workflow')
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)

  const { project } = useReactFlow()

  // Load workers
  useEffect(() => {
    const loadWorkers = async () => {
      try {
        setIsLoading(true)
        const workersData = await fetchWorkers()
        setWorkers(workersData)
      } catch (error) {
        console.error('Failed to load workers:', error)
        toast({
          title: 'Error',
          description: 'Failed to load workers. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadWorkers()
  }, [])

  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // Validate connection
      const sourceNode = nodes.find((node) => node.id === params.source)
      const targetNode = nodes.find((node) => node.id === params.target)

      // Prevent connecting to start node
      if (targetNode?.type === 'startNode') {
        toast({
          title: 'Invalid Connection',
          description: 'Cannot connect to the Start node.',
          variant: 'destructive',
        })
        return
      }

      // Prevent connecting from end node
      if (sourceNode?.type === 'endNode') {
        toast({
          title: 'Invalid Connection',
          description: 'Cannot connect from the End node.',
          variant: 'destructive',
        })
        return
      }

      // Prevent self-connections
      if (params.source === params.target) {
        toast({
          title: 'Invalid Connection',
          description: 'Cannot connect a node to itself.',
          variant: 'destructive',
        })
        return
      }

      // Check for cycles (simplified check)
      const createsCycle = checkForCycles(params, edges)
      if (createsCycle) {
        toast({
          title: 'Invalid Connection',
          description: 'This connection would create a cycle in the workflow.',
          variant: 'destructive',
        })
        return
      }

      // Add the edge if validation passes
      setEdges((eds) => addEdge({ ...params, animated: true, type: 'smoothstep' }, eds))
    },
    [nodes, edges, setEdges]
  )

  // Check for cycles in the workflow
  const checkForCycles = (newConnection: Connection | Edge, currentEdges: Edge[]) => {
    // Simple cycle detection (can be improved for more complex workflows)
    const edgesToCheck = [...currentEdges, newConnection as Edge]
    const visited = new Set<string>()
    const recStack = new Set<string>()

    const hasCycle = (nodeId: string): boolean => {
      if (!visited.has(nodeId)) {
        visited.add(nodeId)
        recStack.add(nodeId)

        const outgoingEdges = edgesToCheck.filter((edge) => edge.source === nodeId)
        for (const edge of outgoingEdges) {
          if (!visited.has(edge.target) && hasCycle(edge.target)) {
            return true
          } else if (recStack.has(edge.target)) {
            return true
          }
        }
      }
      recStack.delete(nodeId)
      return false
    }

    return hasCycle(newConnection.source as string)
  }

  // Handle dropping a worker from the sidebar
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      if (reactFlowWrapper.current && reactFlowInstance) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
        const workerData = JSON.parse(event.dataTransfer.getData('application/reactflow')) as { name: string }

        // Get position from drop coordinates
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        })

        // Create a new node
        const newNode: Node = {
          id: `worker-${Date.now()}`,
          type: 'workerNode',
          position,
          data: {
            ...workerData,
            label: workerData.name,
          },
        }

        setNodes((nds) => nds.concat(newNode))
      }
    },
    [reactFlowInstance, setNodes]
  )

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // Save workflow
  const saveWorkflow = useCallback(() => {
    if (nodes.length <= 2) {
      toast({
        title: 'Cannot Save',
        description: 'Add at least one worker node to your workflow before saving.',
        variant: 'destructive',
      })
      return
    }

    // Check if all nodes are connected
    const nodeIds = new Set(nodes.map((node) => node.id))
    const connectedNodes = new Set<string>()

    // Add start and end to connected set
    connectedNodes.add('start')

    // Build connected set from edges
    edges.forEach((edge) => {
      connectedNodes.add(edge.source)
      connectedNodes.add(edge.target)
    })

    // Check if all nodes are in the connected set
    const disconnectedNodes = Array.from(nodeIds).filter((id) => !connectedNodes.has(id))
    if (disconnectedNodes.length > 0) {
      toast({
        title: 'Disconnected Nodes',
        description: 'All nodes must be connected in the workflow.',
        variant: 'destructive',
      })
      return
    }

    // Create workflow data
    const workflowData = {
      name: workflowName,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges,
    }

    // In a real app, you would save this to your backend
    console.log('Saving workflow:', workflowData)

    // Mock API call
    setTimeout(() => {
      toast({
        title: 'Workflow Saved',
        description: `"${workflowName}" has been saved successfully.`,
      })
    }, 500)

    // Save to localStorage for demo purposes
    localStorage.setItem(`workflow-${Date.now()}`, JSON.stringify(workflowData))
  }, [nodes, edges, workflowName])

  // Export workflow as JSON
  const exportWorkflow = useCallback(() => {
    if (nodes.length <= 2) {
      toast({
        title: 'Cannot Export',
        description: 'Add at least one worker node to your workflow before exporting.',
        variant: 'destructive',
      })
      return
    }

    const workflowData = {
      name: workflowName,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges,
    }

    const jsonString = JSON.stringify(workflowData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${workflowName.replace(/\s+/g, '-').toLowerCase()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [nodes, edges, workflowName])

  // Run workflow simulation
  const runWorkflow = useCallback(() => {
    if (nodes.length <= 2) {
      toast({
        title: 'Cannot Run',
        description: 'Add at least one worker node to your workflow before running.',
        variant: 'destructive',
      })
      return
    }

    toast({
      title: 'Workflow Execution',
      description: 'Workflow execution simulation started.',
    })

    // Simple simulation of workflow execution
    let currentNodeIndex = 0
    const nodeIds = ['start', ...edges.map((edge) => edge.target)]

    const interval = setInterval(() => {
      if (currentNodeIndex >= nodeIds.length) {
        clearInterval(interval)
        toast({
          title: 'Execution Complete',
          description: 'Workflow execution simulation completed successfully.',
        })

        // Reset node styles
        setNodes((nds) =>
          nds.map((node) => ({
            ...node,
            style: { ...node.style, background: undefined },
          }))
        )
        return
      }

      // Highlight current node
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: {
            ...node.style,
            background: node.id === nodeIds[currentNodeIndex] ? '#4ade80' : undefined,
          },
        }))
      )

      currentNodeIndex++
    }, 1000)

    return () => clearInterval(interval)
  }, [nodes, edges, setNodes])

  return (
    <div className="flex h-full flex-col space-y-4">
      <WorkflowHeader workflowName={workflowName} setWorkflowName={setWorkflowName} />

      <div className="flex h-full gap-4">
        <WorkflowSidebar workers={workers} isLoading={isLoading} />

        <div className="flex-1 rounded-lg border bg-background shadow-sm" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              connectionLineType={ConnectionLineType.SmoothStep}
              fitView
              snapToGrid
              snapGrid={[15, 15]}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            >
              <Background />
              <Controls />

              <Panel position="top-right" className="flex gap-2">
                <Button variant="outline" size="sm" onClick={saveWorkflow}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={exportWorkflow}>
                  <FileJson className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={runWorkflow}>
                  <Play className="mr-2 h-4 w-4" />
                  Run
                </Button>
              </Panel>
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  )
}
