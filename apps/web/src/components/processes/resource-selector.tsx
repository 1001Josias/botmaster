'use client'

import { useState, useEffect } from 'react'
import type { Node } from 'reactflow'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'

// Mock data for resources
const mockWorkers = [
  { id: 'worker1', name: 'Customer Verification Worker' },
  { id: 'worker2', name: 'Account Creation Worker' },
  { id: 'worker3', name: 'Email Notification Worker' },
  { id: 'worker4', name: 'Data Processing Worker' },
]

const mockWorkflows = [
  { id: 'workflow1', name: 'Customer Verification Workflow' },
  { id: 'workflow2', name: 'Account Setup Workflow' },
  { id: 'workflow3', name: 'Notification Workflow' },
]

const mockTriggers = [
  { id: 'trigger1', name: 'API Webhook' },
  { id: 'trigger2', name: 'Scheduled Event' },
  { id: 'trigger3', name: 'Message Queue' },
]

interface ResourceSelectorProps {
  node: Node
  updateNodeData: (nodeId: string, data: any) => void
}

export function ResourceSelector({ node, updateNodeData }: ResourceSelectorProps) {
  const { toast } = useToast()
  const [resourceType, setResourceType] = useState<string>('')
  const [resourceId, setResourceId] = useState<string>('')
  const [configuration, setConfiguration] = useState<any>({})
  const [activeTab, setActiveTab] = useState('resource')

  useEffect(() => {
    // Initialize from existing implementation data if available
    if (node.data.implementation) {
      setResourceType(node.data.implementation.resourceType || '')
      setResourceId(node.data.implementation.resourceId || '')
      setConfiguration(node.data.implementation.configuration || {})
    } else {
      // Set default resource type based on node type
      const defaultType = getDefaultResourceType(node.type || '')
      setResourceType(defaultType)
      setResourceId('')
      setConfiguration({})
    }
  }, [node])

  const getDefaultResourceType = (nodeType: string): string => {
    switch (nodeType) {
      case 'task':
      case 'serviceTask':
      case 'scriptTask':
        return 'worker'
      case 'userTask':
      case 'sendTask':
      case 'businessRuleTask':
        return 'workflow'
      case 'startEvent':
      case 'messageEvent':
      case 'signalEvent':
      case 'timerEvent':
        return 'trigger'
      case 'exclusiveGateway':
      case 'inclusiveGateway':
      case 'parallelGateway':
      case 'eventGateway':
        return 'condition'
      default:
        return ''
    }
  }

  const getResourceOptions = () => {
    switch (resourceType) {
      case 'worker':
        return mockWorkers
      case 'workflow':
        return mockWorkflows
      case 'trigger':
        return mockTriggers
      default:
        return []
    }
  }

  const handleSave = () => {
    updateNodeData(node.id, {
      implementation: {
        resourceType,
        resourceId,
        configuration,
      },
    })

    toast({
      title: 'Resource connected',
      description: `Successfully connected ${resourceType} to "${node.data.label}"`,
    })
  }

  const renderResourceSelector = () => {
    return (
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="resourceType">Resource Type</Label>
          <Select
            value={resourceType}
            onValueChange={(value) => {
              setResourceType(value)
              setResourceId('')
            }}
          >
            <SelectTrigger id="resourceType">
              <SelectValue placeholder="Select resource type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="worker">Worker</SelectItem>
              <SelectItem value="workflow">Workflow</SelectItem>
              <SelectItem value="trigger">Trigger</SelectItem>
              {(node.type === 'exclusiveGateway' || node.type === 'inclusiveGateway') && (
                <SelectItem value="condition">Condition</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {resourceType && resourceType !== 'condition' && (
          <div className="grid gap-2">
            <Label htmlFor="resourceId">Select {resourceType}</Label>
            <Select value={resourceId} onValueChange={(value) => setResourceId(value)}>
              <SelectTrigger id="resourceId">
                <SelectValue placeholder={`Select a ${resourceType}`} />
              </SelectTrigger>
              <SelectContent>
                {getResourceOptions().map((resource) => (
                  <SelectItem key={resource.id} value={resource.id}>
                    {resource.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {resourceType === 'condition' && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="conditionType">Condition Type</Label>
              <Select
                value={configuration.conditionType || 'expression'}
                onValueChange={(value) => setConfiguration({ ...configuration, conditionType: value })}
              >
                <SelectTrigger id="conditionType">
                  <SelectValue placeholder="Select condition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expression">Expression</SelectItem>
                  <SelectItem value="variable">Variable Comparison</SelectItem>
                  <SelectItem value="status">Status Check</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {configuration.conditionType === 'expression' && (
              <div className="grid gap-2">
                <Label htmlFor="expression">Expression</Label>
                <Textarea
                  id="expression"
                  placeholder="Enter condition expression (e.g., result == 'success')"
                  value={configuration.expression || ''}
                  onChange={(e) =>
                    setConfiguration({
                      ...configuration,
                      expression: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {configuration.conditionType === 'variable' && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="variableName">Variable Name</Label>
                  <Input
                    id="variableName"
                    placeholder="Enter variable name"
                    value={configuration.variableName || ''}
                    onChange={(e) =>
                      setConfiguration({
                        ...configuration,
                        variableName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="operator">Operator</Label>
                  <Select
                    value={configuration.operator || 'equals'}
                    onValueChange={(value) => setConfiguration({ ...configuration, operator: value })}
                  >
                    <SelectTrigger id="operator">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="notEquals">Not Equals</SelectItem>
                      <SelectItem value="greaterThan">Greater Than</SelectItem>
                      <SelectItem value="lessThan">Less Than</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    placeholder="Enter comparison value"
                    value={configuration.value || ''}
                    onChange={(e) =>
                      setConfiguration({
                        ...configuration,
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {configuration.conditionType === 'status' && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={configuration.status || 'success'}
                  onValueChange={(value) => setConfiguration({ ...configuration, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="timeout">Timeout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {resourceType === 'trigger' && node.type === 'timerEvent' && (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="timerType">Timer Type</Label>
              <Select
                value={configuration.timerType || 'date'}
                onValueChange={(value) => setConfiguration({ ...configuration, timerType: value })}
              >
                <SelectTrigger id="timerType">
                  <SelectValue placeholder="Select timer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Specific Date</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="cycle">Cycle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {configuration.timerType === 'date' && (
              <div className="grid gap-2">
                <Label htmlFor="date">Date and Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={configuration.date || ''}
                  onChange={(e) =>
                    setConfiguration({
                      ...configuration,
                      date: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {configuration.timerType === 'duration' && (
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (ISO 8601)</Label>
                <Input
                  id="duration"
                  placeholder="e.g., PT15M for 15 minutes"
                  value={configuration.duration || ''}
                  onChange={(e) =>
                    setConfiguration({
                      ...configuration,
                      duration: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Examples: PT15M (15 minutes), PT2H (2 hours), P1D (1 day)
                </p>
              </div>
            )}

            {configuration.timerType === 'cycle' && (
              <div className="grid gap-2">
                <Label htmlFor="cycle">Cron Expression</Label>
                <Input
                  id="cycle"
                  placeholder="e.g., 0 0 * * * for daily at midnight"
                  value={configuration.cycle || ''}
                  onChange={(e) =>
                    setConfiguration({
                      ...configuration,
                      cycle: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">Format: minute hour day-of-month month day-of-week</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const renderAdvancedSettings = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="retryOnFailure">Retry on Failure</Label>
          <Switch
            id="retryOnFailure"
            checked={configuration.retryOnFailure || false}
            onCheckedChange={(checked) => setConfiguration({ ...configuration, retryOnFailure: checked })}
          />
        </div>

        {configuration.retryOnFailure && (
          <div className="grid gap-2">
            <Label htmlFor="maxRetries">Maximum Retries</Label>
            <Input
              id="maxRetries"
              type="number"
              min="1"
              max="10"
              value={configuration.maxRetries || 3}
              onChange={(e) =>
                setConfiguration({
                  ...configuration,
                  maxRetries: Number.parseInt(e.target.value),
                })
              }
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="timeout">Enable Timeout</Label>
          <Switch
            id="timeout"
            checked={configuration.timeoutEnabled || false}
            onCheckedChange={(checked) => setConfiguration({ ...configuration, timeoutEnabled: checked })}
          />
        </div>

        {configuration.timeoutEnabled && (
          <div className="grid gap-2">
            <Label htmlFor="timeoutDuration">Timeout (seconds)</Label>
            <Input
              id="timeoutDuration"
              type="number"
              min="1"
              value={configuration.timeoutDuration || 60}
              onChange={(e) =>
                setConfiguration({
                  ...configuration,
                  timeoutDuration: Number.parseInt(e.target.value),
                })
              }
            />
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add implementation notes..."
            value={configuration.notes || ''}
            onChange={(e) =>
              setConfiguration({
                ...configuration,
                notes: e.target.value,
              })
            }
          />
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure {node.data.label}</CardTitle>
        <CardDescription>Connect resources and configure settings for this {node.type} node</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="resource">Resource</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="resource">{renderResourceSelector()}</TabsContent>
          <TabsContent value="advanced">{renderAdvancedSettings()}</TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>
      </CardContent>
    </Card>
  )
}
