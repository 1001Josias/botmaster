import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export type Trigger = z.infer<typeof TriggerSchema>
export type CreateTrigger = z.infer<typeof CreateTriggerSchema>
export type UpdateTrigger = z.infer<typeof UpdateTriggerSchema>
export type TriggerStats = z.infer<typeof TriggerStatsSchema>

// Enums
export const TriggerTypeEnum = z.enum(['schedule', 'webhook', 'event', 'data']).openapi({
  description: 'Type of trigger',
  example: 'schedule',
})

export const TriggerStatusEnum = z.enum(['active', 'inactive', 'error']).openapi({
  description: 'Status of trigger',
  example: 'active',
})

export const TargetTypeEnum = z.enum(['workflow', 'worker']).openapi({
  description: 'Type of target to execute',
  example: 'workflow',
})

export const WebhookMethodEnum = z.enum(['GET', 'POST', 'PUT', 'DELETE']).openapi({
  description: 'HTTP method for webhook',
  example: 'POST',
})

// Base trigger schema
export const TriggerSchema = z.object({
  id: z.number().int().positive().openapi({
    description: 'Unique identifier',
    example: 1,
  }),
  name: z.string().min(2).max(255).openapi({
    description: 'Trigger name',
    example: 'Daily Report Trigger',
  }),
  description: z.string().nullable().openapi({
    description: 'Optional description',
    example: 'Generates daily reports at 8 AM',
  }),
  type: TriggerTypeEnum,
  targetType: TargetTypeEnum,
  workflowId: z.string().nullable().openapi({
    description: 'Workflow ID to execute (if target_type is workflow)',
    example: 'WF-003',
  }),
  workerId: z.string().nullable().openapi({
    description: 'Worker ID to execute (if target_type is worker)',
    example: 'W-002',
  }),
  status: TriggerStatusEnum,
  isActive: z.boolean().openapi({
    description: 'Whether the trigger is enabled',
    example: true,
  }),
  
  // Schedule-specific fields
  scheduleFrequency: z.string().nullable().openapi({
    description: 'Schedule frequency for schedule triggers',
    example: 'daily',
  }),
  cronExpression: z.string().nullable().openapi({
    description: 'Cron expression for custom schedules',
    example: '0 8 * * 1-5',
  }),
  
  // Webhook-specific fields
  webhookEndpoint: z.string().nullable().openapi({
    description: 'Webhook endpoint path',
    example: '/api/webhooks/payment',
  }),
  webhookMethod: WebhookMethodEnum.nullable().openapi({
    description: 'HTTP method for webhook',
  }),
  webhookSecret: z.string().nullable().openapi({
    description: 'Secret for webhook validation',
    example: 'secret123',
  }),
  
  // Event-specific fields
  eventSource: z.string().nullable().openapi({
    description: 'Source of the event',
    example: 'user',
  }),
  eventName: z.string().nullable().openapi({
    description: 'Name of the event',
    example: 'created',
  }),
  
  // Data condition-specific fields
  dataSource: z.string().nullable().openapi({
    description: 'Source of data to monitor',
    example: 'database',
  }),
  dataCondition: z.string().nullable().openapi({
    description: 'Condition expression',
    example: 'quantity < threshold',
  }),
  
  // Execution tracking
  lastRunAt: z.string().nullable().openapi({
    description: 'Last execution timestamp',
    example: '2023-03-15T08:00:00Z',
  }),
  nextRunAt: z.string().nullable().openapi({
    description: 'Next scheduled execution timestamp',
    example: '2023-03-16T08:00:00Z',
  }),
  executionCount: z.number().int().min(0).openapi({
    description: 'Total number of executions',
    example: 245,
  }),
  
  // Metadata
  createdAt: z.string().openapi({
    description: 'Creation timestamp',
    example: '2023-03-01T10:00:00Z',
  }),
  updatedAt: z.string().openapi({
    description: 'Last update timestamp',
    example: '2023-03-15T14:30:00Z',
  }),
  createdBy: z.string().nullable().openapi({
    description: 'User who created the trigger',
    example: 'admin',
  }),
  updatedBy: z.string().nullable().openapi({
    description: 'User who last updated the trigger',
    example: 'admin',
  }),
}).openapi({
  title: 'Trigger',
  description: 'A trigger configuration that can start workflows or workers',
})

// Create trigger schema (without auto-generated fields)
export const CreateTriggerSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().optional(),
  type: TriggerTypeEnum,
  targetType: TargetTypeEnum,
  workflowId: z.string().optional(),
  workerId: z.string().optional(),
  isActive: z.boolean().default(true),
  
  // Schedule-specific fields
  scheduleFrequency: z.string().optional(),
  cronExpression: z.string().optional(),
  
  // Webhook-specific fields
  webhookEndpoint: z.string().optional(),
  webhookMethod: WebhookMethodEnum.optional(),
  webhookSecret: z.string().optional(),
  
  // Event-specific fields
  eventSource: z.string().optional(),
  eventName: z.string().optional(),
  
  // Data condition-specific fields
  dataSource: z.string().optional(),
  dataCondition: z.string().optional(),
  
  createdBy: z.string().optional(),
}).openapi({
  title: 'CreateTrigger',
  description: 'Data required to create a new trigger',
}).refine(
  (data) => {
    if (data.targetType === 'workflow') {
      return !!data.workflowId
    } else {
      return !!data.workerId
    }
  },
  {
    message: 'workflowId is required when targetType is workflow, workerId is required when targetType is worker',
    path: ['workflowId', 'workerId'],
  }
).refine(
  (data) => {
    // Validate type-specific required fields
    switch (data.type) {
      case 'schedule':
        return !!(data.scheduleFrequency || data.cronExpression)
      case 'webhook':
        return !!(data.webhookEndpoint && data.webhookMethod)
      case 'event':
        return !!(data.eventSource && data.eventName)
      case 'data':
        return !!(data.dataSource && data.dataCondition)
      default:
        return false
    }
  },
  {
    message: 'Required fields for the specified trigger type are missing',
  }
)

// Update trigger schema - manual partial since we can't use .partial() on ZodEffects
export const UpdateTriggerSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  description: z.string().optional(),
  type: TriggerTypeEnum.optional(),
  targetType: TargetTypeEnum.optional(), 
  workflowId: z.string().optional(),
  workerId: z.string().optional(),
  isActive: z.boolean().optional(),
  
  scheduleFrequency: z.string().optional(),
  cronExpression: z.string().optional(),
  
  webhookEndpoint: z.string().optional(),
  webhookMethod: WebhookMethodEnum.optional(),
  webhookSecret: z.string().optional(),
  
  eventSource: z.string().optional(),
  eventName: z.string().optional(),
  
  dataSource: z.string().optional(),
  dataCondition: z.string().optional(),
  
  updatedBy: z.string().optional(),
}).openapi({
  title: 'UpdateTrigger',
  description: 'Data for updating an existing trigger',
})

// Get trigger schema
export const GetTriggerSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').openapi({
      description: 'Trigger ID',
      example: '1',
    }),
  }),
}).openapi({
  title: 'GetTrigger',
  description: 'Parameters for getting a trigger by ID',
})

// Toggle trigger status schema
export const ToggleTriggerStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
  body: z.object({
    isActive: z.boolean().openapi({
      description: 'New active status',
      example: true,
    }),
    updatedBy: z.string().optional(),
  }),
}).openapi({
  title: 'ToggleTriggerStatus',
  description: 'Toggle trigger active status',
})

// Execute trigger schema
export const ExecuteTriggerSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number'),
  }),
  body: z.object({
    executedBy: z.string().optional(),
  }),
}).openapi({
  title: 'ExecuteTrigger',
  description: 'Execute trigger manually',
})

// Trigger stats schema
export const TriggerStatsSchema = z.object({
  total: z.number().int().min(0).openapi({
    description: 'Total number of triggers',
    example: 42,
  }),
  active: z.number().int().min(0).openapi({
    description: 'Number of active triggers',
    example: 38,
  }),
  inactive: z.number().int().min(0).openapi({
    description: 'Number of inactive triggers',
    example: 3,
  }),
  error: z.number().int().min(0).openapi({
    description: 'Number of triggers with errors',
    example: 1,
  }),
  byType: z.object({
    schedule: z.number().int().min(0).openapi({ example: 15 }),
    webhook: z.number().int().min(0).openapi({ example: 12 }),
    event: z.number().int().min(0).openapi({ example: 8 }),
    data: z.number().int().min(0).openapi({ example: 7 }),
  }).openapi({
    description: 'Breakdown by trigger type',
  }),
  totalExecutions: z.number().int().min(0).openapi({
    description: 'Total number of executions across all triggers',
    example: 15234,
  }),
}).openapi({
  title: 'TriggerStats',
  description: 'Statistics about triggers',
})

// Query parameters for listing triggers
export const GetTriggersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1').openapi({
    description: 'Page number',
    example: '1',
  }),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10').openapi({
    description: 'Items per page',
    example: '10',
  }),
  type: TriggerTypeEnum.optional().openapi({
    description: 'Filter by trigger type',
  }),
  status: TriggerStatusEnum.optional().openapi({
    description: 'Filter by trigger status',
  }),
  targetType: TargetTypeEnum.optional().openapi({
    description: 'Filter by target type',
  }),
  search: z.string().optional().openapi({
    description: 'Search in name and description',
    example: 'daily',
  }),
}).openapi({
  title: 'GetTriggersQuery',
  description: 'Query parameters for listing triggers',
})

// Paginated triggers response
export const PaginatedTriggersSchema = z.object({
  data: z.array(TriggerSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(0),
  }),
}).openapi({
  title: 'PaginatedTriggers',
  description: 'Paginated list of triggers',
})