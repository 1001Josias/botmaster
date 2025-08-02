'use client'
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'

import { Card, CardContent } from '@/components/ui/card'
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

// Mock data for a process diagram
const initialNodes = [
  {
    id: 'start',
    type: 'startEvent',
    position: { x: 250, y: 100 },
    data: { label: 'Start', type: 'startEvent' },
  },
  {
    id: 'task1',
    type: 'task',
    position: { x: 400, y: 100 },
    data: { label: 'Verify Customer', type: 'task' },
  },
  {
    id: 'gateway1',
    type: 'exclusiveGateway',
    position: { x: 600, y: 100 },
    data: { label: 'Valid?', type: 'exclusiveGateway' },
  },
  {
    id: 'task2',
    type: 'userTask',
    position: { x: 800, y: 25 },
    data: { label: 'Request Additional Info', type: 'userTask' },
  },
  {
    id: 'task3',
    type: 'serviceTask',
    position: { x: 800, y: 175 },
    data: { label: 'Create Account', type: 'serviceTask' },
  },
  {
    id: 'end',
    type: 'endEvent',
    position: { x: 1000, y: 100 },
    data: { label: 'End', type: 'endEvent' },
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
const nodeTypes = {
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

function ProcessDiagramContent({ id }: { id: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  return (
    <Card>
      <CardContent className="p-0">
        <div style={{ height: 600 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProcessDiagram({ id }: { id: string }) {
  return (
    <ReactFlowProvider>
      <ProcessDiagramContent id={id} />
    </ReactFlowProvider>
  )
}
