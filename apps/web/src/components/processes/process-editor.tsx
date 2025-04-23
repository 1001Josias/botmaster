'use client'

import type React from 'react'

import { useCallback, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type NodeTypes,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { ProcessEditorHeader } from './process-editor-header'
import { BpmnPalette } from './bpmn-palette'
import { BpmnStartEvent } from './bpmn-nodes/bpmn-start-event'
import { BpmnEndEvent } from './bpmn-nodes/bpmn-end-event'
import { BpmnTask } from './bpmn-nodes/bpmn-task'
import { BpmnGateway } from './bpmn-nodes/bpmn-gateway'
import { BpmnTimerEvent } from './bpmn-nodes/bpmn-timer-event'
import { BpmnMessageEvent } from './bpmn-nodes/bpmn-message-event'
import { BpmnUserTask } from './bpmn-nodes/bpmn-user-task'
import { BpmnServiceTask } from './bpmn-nodes/bpmn-service-task'
import { BpmnScriptTask } from './bpmn-nodes/bpmn-script-task'
import { BpmnSendTask } from './bpmn-nodes/bpmn-send-task'
import { BpmnBusinessRuleTask } from './bpmn-nodes/bpmn-business-rule-task'
import { BpmnErrorEvent } from './bpmn-nodes/bpmn-error-event'
import { BpmnSignalEvent } from './bpmn-nodes/bpmn-signal-event'
import { useToast } from '@/components/ui/use-toast'

// Define node types
const nodeTypes: NodeTypes = {
  startEvent: BpmnStartEvent,
  endEvent: BpmnEndEvent,
  task: BpmnTask,
  userTask: BpmnUserTask,
  serviceTask: BpmnServiceTask,
  scriptTask: BpmnScriptTask,
  sendTask: BpmnSendTask,
  businessRuleTask: BpmnBusinessRuleTask,
  exclusiveGateway: BpmnGateway,
  parallelGateway: BpmnGateway,
  inclusiveGateway: BpmnGateway,
  eventGateway: BpmnGateway,
  timerEvent: BpmnTimerEvent,
  messageEvent: BpmnMessageEvent,
  errorEvent: BpmnErrorEvent,
  signalEvent: BpmnSignalEvent,
}

// Initial nodes for a new process
const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'startEvent',
    position: { x: 250, y: 100 },
    data: { label: 'Start', type: 'startEvent' },
  },
]

function ProcessEditorContent() {
  const { toast } = useToast()
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [processName, setProcessName] = useState('')
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const { project } = useReactFlow()

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      if (!type || !reactFlowBounds || !reactFlowInstance) {
        return
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: getDefaultLabel(type), type },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes]
  )

  const getDefaultLabel = (type: string): string => {
    switch (type) {
      case 'startEvent':
        return 'Start'
      case 'endEvent':
        return 'End'
      case 'task':
        return 'Task'
      case 'userTask':
        return 'User Task'
      case 'serviceTask':
        return 'Service Task'
      case 'scriptTask':
        return 'Script Task'
      case 'sendTask':
        return 'Send Task'
      case 'businessRuleTask':
        return 'Business Rule'
      case 'exclusiveGateway':
        return 'Exclusive Gateway'
      case 'parallelGateway':
        return 'Parallel Gateway'
      case 'inclusiveGateway':
        return 'Inclusive Gateway'
      case 'eventGateway':
        return 'Event Gateway'
      case 'timerEvent':
        return 'Timer'
      case 'messageEvent':
        return 'Message'
      case 'errorEvent':
        return 'Error'
      case 'signalEvent':
        return 'Signal'
      default:
        return 'Node'
    }
  }

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleSave = () => {
    if (!processName) {
      toast({
        title: 'Process name required',
        description: 'Please provide a name for your process',
        variant: 'destructive',
      })
      return
    }

    // In a real application, this would save to a backend
    const processData = {
      name: processName,
      nodes,
      edges,
      lastSaved: new Date().toISOString(),
    }

    localStorage.setItem(`process-${Date.now()}`, JSON.stringify(processData))

    toast({
      title: 'Process saved',
      description: 'Your process has been saved successfully',
    })
  }

  const handleExport = () => {
    const processData = {
      name: processName || 'Untitled Process',
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    }

    const jsonString = JSON.stringify(processData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${processName || 'process'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        type ProcessData = {
          name?: string
          nodes: Node[]
          edges: any[]
        }

        const processData = JSON.parse(event.target?.result as string) as ProcessData
        if (processData.nodes && processData.edges) {
          setNodes(processData.nodes)
          setEdges(processData.edges)
          if (processData.name) {
            setProcessName(processData.name)
          }
          toast({
            title: 'Process imported',
            description: 'Your process has been imported successfully',
          })
        } else {
          throw new Error('Invalid process data')
        }
      } catch (error) {
        toast({
          title: 'Import failed',
          description: 'The file contains invalid process data',
          variant: 'destructive',
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex h-full flex-col">
      <ProcessEditorHeader
        processName={processName}
        setProcessName={setProcessName}
        onSave={handleSave}
        onExport={handleExport}
        onImport={handleImport}
      />
      <div className="flex h-full">
        <div className="w-64 border-r">
          <BpmnPalette onDragStart={onDragStart} />
        </div>
        <div className="flex-1" ref={reactFlowWrapper}>
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
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
            <Panel position="top-right">
              <div className="rounded-md bg-background p-2 shadow-md">
                <p className="text-xs text-muted-foreground">Drag elements from the palette to the canvas</p>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

export function ProcessEditor() {
  return (
    <ReactFlowProvider>
      <ProcessEditorContent />
    </ReactFlowProvider>
  )
}
