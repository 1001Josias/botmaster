'use client'

import type React from 'react'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  type Node,
  type Connection,
  addEdge,
  type NodeTypes,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Check, Save } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

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
import { ResourceSelector } from './resource-selector'
import { ProcessValidation } from './process-validation'

// Mock data for a process diagram
type NodeData = {
  label: string
  type: string
  implementation?: {
    resourceId?: string
    configuration?: string
  }
}

const initialNodes = [
  {
    id: 'start',
    type: 'startEvent',
    position: { x: 250, y: 100 },
    data: { label: 'Start', type: 'startEvent' } as NodeData,
  },
  {
    id: 'task1',
    type: 'task',
    position: { x: 400, y: 100 },
    data: { label: 'Verify Customer', type: 'task' } as NodeData,
  },
  {
    id: 'gateway1',
    type: 'exclusiveGateway',
    position: { x: 600, y: 100 },
    data: { label: 'Valid?', type: 'exclusiveGateway' } as NodeData,
  },
  {
    id: 'task2',
    type: 'userTask',
    position: { x: 800, y: 25 },
    data: { label: 'Request Additional Info', type: 'userTask' } as NodeData,
  },
  {
    id: 'task3',
    type: 'serviceTask',
    position: { x: 800, y: 175 },
    data: { label: 'Create Account', type: 'serviceTask' } as NodeData,
  },
  {
    id: 'end',
    type: 'endEvent',
    position: { x: 1000, y: 100 },
    data: { label: 'End', type: 'endEvent' } as NodeData,
  },
]

const initialEdges = [
  { id: 'e1-2', source: 'start', target: 'task1' },
  { id: 'e2-3', source: 'task1', target: 'gateway1' },
  { id: 'e3-4', source: 'gateway1', target: 'task2', label: 'No' },
  { id: 'e3-5', source: 'gateway1', target: 'task3', label: 'Yes' },
  { id: 'e4-1', source: 'task2', target: 'task1' },
  { id: 'e5-6', source: 'task3', target: 'end' },
]

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

function ProcessImplementationContent({ id }: { id: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [activeTab, setActiveTab] = useState('diagram')
  const [validationIssues, setValidationIssues] = useState<string[]>([])

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setActiveTab('resources')
  }, [])

  const updateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            }
          }
          return node
        })
      )
    },
    [setNodes]
  )

  const validateProcess = useCallback(() => {
    const issues: string[] = []

    // Check if all tasks have resources connected
    nodes.forEach((node) => {
      if (
        ['task', 'userTask', 'serviceTask', 'scriptTask', 'sendTask', 'businessRuleTask'].includes(node.type || '') &&
        (!node.data.implementation || !node.data.implementation.resourceId)
      ) {
        issues.push(`Task "${node.data.label}" has no resource connected.`)
      }

      if (
        ['exclusiveGateway', 'inclusiveGateway'].includes(node.type || '') &&
        (!node.data.implementation || !node.data.implementation.configuration)
      ) {
        issues.push(`Gateway "${node.data.label}" has no conditions configured.`)
      }

      if (
        ['timerEvent'].includes(node.type || '') &&
        (!node.data.implementation || !node.data.implementation.configuration)
      ) {
        issues.push(`Timer "${node.data.label}" has no timing configured.`)
      }

      if (
        ['messageEvent', 'signalEvent'].includes(node.type || '') &&
        (!node.data.implementation || !node.data.implementation.resourceId)
      ) {
        issues.push(`Event "${node.data.label}" has no trigger connected.`)
      }
    })

    setValidationIssues(issues)
    return issues.length === 0
  }, [nodes])

  const handleSave = useCallback(() => {
    const isValid = validateProcess()
    if (isValid) {
      // In a real application, this would save to a backend
      toast({
        title: 'Process implementation saved',
        description: 'Your implementation has been saved successfully',
      })
    } else {
      toast({
        title: 'Validation failed',
        description: 'Please fix the validation issues before saving',
        variant: 'destructive',
      })
    }
  }, [validateProcess, toast])

  const handlePublish = useCallback(() => {
    const isValid = validateProcess()
    if (isValid) {
      // In a real application, this would publish the process
      toast({
        title: 'Process published',
        description: 'Your process has been published successfully',
      })
      router.push('/processes')
    } else {
      toast({
        title: 'Validation failed',
        description: 'Please fix the validation issues before publishing',
        variant: 'destructive',
      })
    }
  }, [validateProcess, toast, router])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/processes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Implement Process: Customer Onboarding</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Check className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mx-4 mt-2">
              <TabsTrigger value="diagram">Diagram</TabsTrigger>
              <TabsTrigger value="resources">
                Resources {selectedNode ? `(${selectedNode.data.label})` : ''}
              </TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>
            <TabsContent value="diagram" className="h-[calc(100vh-8rem)] p-0">
              <div className="h-full">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={onNodeClick}
                  nodeTypes={nodeTypes}
                  fitView
                >
                  <Controls />
                  <MiniMap />
                  <Background gap={12} size={1} />
                  <Panel position="top-left">
                    <div className="rounded-md bg-background p-2 shadow-md">
                      <p className="text-xs text-muted-foreground">Click on a node to connect resources</p>
                    </div>
                  </Panel>
                </ReactFlow>
              </div>
            </TabsContent>
            <TabsContent value="resources" className="p-4">
              {selectedNode ? (
                <ResourceSelector node={selectedNode} updateNodeData={updateNodeData} />
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <Alert>
                      <AlertTitle>No node selected</AlertTitle>
                      <AlertDescription>Please select a node from the diagram to connect resources.</AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="validation" className="p-4">
              <ProcessValidation issues={validationIssues} onValidate={validateProcess} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export function ProcessImplementation({ id }: { id: string }) {
  return (
    <ReactFlowProvider>
      <ProcessImplementationContent id={id} />
    </ReactFlowProvider>
  )
}
