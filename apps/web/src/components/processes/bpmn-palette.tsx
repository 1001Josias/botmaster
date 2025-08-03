'use client'

import type React from 'react'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Circle,
  Square,
  Diamond,
  Clock,
  MessageSquare,
  Flag,
  GitMerge,
  GitBranch,
  AlertCircle,
  CheckCircle,
  FileText,
  Users,
  Database,
  Mail,
  Workflow,
} from 'lucide-react'

interface BpmnElementProps {
  icon: React.ReactNode
  label: string
  type: string
  onDragStart: (event: React.DragEvent, nodeType: string) => void
}

function BpmnElement({ icon, label, type, onDragStart }: BpmnElementProps) {
  return (
    <div
      className="flex cursor-grab flex-col items-center gap-1 rounded-md border p-2 hover:bg-accent"
      draggable
      onDragStart={(event) => onDragStart(event, type)}
    >
      <div className="flex h-10 w-10 items-center justify-center">{icon}</div>
      <span className="text-xs text-center">{label}</span>
    </div>
  )
}

interface BpmnPaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void
}

export function BpmnPalette({ onDragStart }: BpmnPaletteProps) {
  const [activeTab, setActiveTab] = useState('events')

  return (
    <Card className="h-full">
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-sm">BPMN Elements</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events" className="text-xs">
              Events
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-xs">
              Activities
            </TabsTrigger>
            <TabsTrigger value="gateways" className="text-xs">
              Gateways
            </TabsTrigger>
            <TabsTrigger value="other" className="text-xs">
              Other
            </TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[calc(100vh-12rem)] mt-2">
            <TabsContent value="events" className="m-0">
              <div className="grid grid-cols-2 gap-2">
                <BpmnElement
                  icon={<Circle className="h-8 w-8 text-green-500" />}
                  label="Start Event"
                  type="startEvent"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<Circle className="h-8 w-8 text-red-500" />}
                  label="End Event"
                  type="endEvent"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<Clock className="h-8 w-8 text-blue-500" />}
                  label="Timer Event"
                  type="timerEvent"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<MessageSquare className="h-8 w-8 text-purple-500" />}
                  label="Message Event"
                  type="messageEvent"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<AlertCircle className="h-8 w-8 text-yellow-500" />}
                  label="Error Event"
                  type="errorEvent"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<Flag className="h-8 w-8 text-orange-500" />}
                  label="Signal Event"
                  type="signalEvent"
                  onDragStart={onDragStart}
                />
              </div>
            </TabsContent>
            <TabsContent value="activities" className="m-0">
              <div className="grid grid-cols-2 gap-2">
                <BpmnElement
                  icon={<Square className="h-8 w-8 text-blue-500" />}
                  label="Task"
                  type="task"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<Users className="h-8 w-8 text-indigo-500" />}
                  label="User Task"
                  type="userTask"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<Workflow className="h-8 w-8 text-cyan-500" />}
                  label="Service Task"
                  type="serviceTask"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<Database className="h-8 w-8 text-emerald-500" />}
                  label="Script Task"
                  type="scriptTask"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<Mail className="h-8 w-8 text-pink-500" />}
                  label="Send Task"
                  type="sendTask"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<FileText className="h-8 w-8 text-amber-500" />}
                  label="Business Rule"
                  type="businessRuleTask"
                  onDragStart={onDragStart}
                />
              </div>
            </TabsContent>
            <TabsContent value="gateways" className="m-0">
              <div className="grid grid-cols-2 gap-2">
                <BpmnElement
                  icon={<Diamond className="h-8 w-8 text-yellow-500" />}
                  label="Exclusive Gateway"
                  type="exclusiveGateway"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<GitMerge className="h-8 w-8 text-green-500" />}
                  label="Parallel Gateway"
                  type="parallelGateway"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<GitBranch className="h-8 w-8 text-blue-500" />}
                  label="Inclusive Gateway"
                  type="inclusiveGateway"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<Diamond className="h-8 w-8 text-purple-500" />}
                  label="Event Gateway"
                  type="eventGateway"
                  onDragStart={onDragStart}
                />
              </div>
            </TabsContent>
            <TabsContent value="other" className="m-0">
              <div className="grid grid-cols-2 gap-2">
                <BpmnElement
                  icon={<CheckCircle className="h-8 w-8 text-green-500" />}
                  label="Subprocess"
                  type="subProcess"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<Square className="h-8 w-8 text-gray-500 border-2 border-dashed" />}
                  label="Data Object"
                  type="dataObject"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<Database className="h-8 w-8 text-gray-500" />}
                  label="Data Store"
                  type="dataStore"
                  onDragStart={onDragStart}
                />
                <BpmnElement
                  icon={<Users className="h-8 w-8 text-orange-500" />}
                  label="Pool/Lane"
                  type="pool"
                  onDragStart={onDragStart}
                />
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  )
}
