"use client"

import { useState } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, Info, Code, PlayCircle, Database, Workflow, Zap, Server, Bot } from "lucide-react"

export function WorkerNode({ data, isConnectable }: NodeProps) {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <Card className="w-60 shadow-md border-2">
        <CardHeader className="p-3 pb-0">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="px-2 py-0 text-xs">
              {data.type || "worker"}
            </Badge>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Configure Worker: {data.name}</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="info">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="inputs">Inputs</TabsTrigger>
                    <TabsTrigger value="outputs">Outputs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="worker-name">Name</Label>
                      <Input id="worker-name" value={data.name} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="worker-description">Description</Label>
                      <Textarea id="worker-description" value={data.description} readOnly rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <div className="flex items-center gap-2">
                        {getWorkerIcon(data.type)}
                        <span className="text-sm">{data.type}</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="inputs" className="space-y-4 py-4">
                    {data.inputs && data.inputs.length > 0 ? (
                      data.inputs.map((input: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <Label htmlFor={`input-${index}`}>{input.name}</Label>
                          <div className="flex gap-2">
                            <Input
                              id={`input-${index}`}
                              placeholder={input.description || "Enter value"}
                              defaultValue={input.defaultValue || ""}
                            />
                            <Button variant="outline" size="icon">
                              <Code className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {input.description || "No description available"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Info className="h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-2 text-lg font-medium">No inputs required</h3>
                        <p className="text-sm text-muted-foreground">
                          This worker doesn't require any input parameters
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="outputs" className="space-y-4 py-4">
                    {data.outputs && data.outputs.length > 0 ? (
                      data.outputs.map((output: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>{output.name}</Label>
                            <Badge variant="outline">{output.type}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {output.description || "No description available"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Info className="h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-2 text-lg font-medium">No defined outputs</h3>
                        <p className="text-sm text-muted-foreground">Output schema is not defined for this worker</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
          <CardTitle className="text-base mt-1 truncate" title={data.name}>
            {data.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <p className="text-xs text-muted-foreground line-clamp-2" title={data.description}>
            {data.description}
          </p>
        </CardContent>
        <CardFooter className="p-2 flex justify-between bg-muted/50 rounded-b-lg">
          <div className="flex items-center text-xs text-muted-foreground">
            <PlayCircle className="h-3 w-3 mr-1" />
            {data.executionTime || "~1s"}
          </div>
          <div className="flex items-center">{getWorkerIcon(data.type)}</div>
        </CardFooter>
      </Card>

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#64748b", width: "10px", height: "10px" }}
        isConnectable={isConnectable}
      />

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#64748b", width: "10px", height: "10px" }}
        isConnectable={isConnectable}
      />
    </>
  )
}

function getWorkerIcon(type: string) {
  switch (type) {
    case "data":
      return <Database className="h-4 w-4 text-blue-500" />
    case "process":
      return <Workflow className="h-4 w-4 text-purple-500" />
    case "api":
      return <Zap className="h-4 w-4 text-yellow-500" />
    case "system":
      return <Server className="h-4 w-4 text-green-500" />
    default:
      return <Bot className="h-4 w-4 text-gray-500" />
  }
}

