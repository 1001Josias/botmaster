import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import express, { type Router } from 'express'
import { z } from 'zod'

import { createOpenApiResponse } from '@/api-docs/openAPIResponseBuilders'
import { 
  TriggerSchema,
  CreateTriggerSchema,
  UpdateTriggerSchema,
  GetTriggerSchema,
  ToggleTriggerStatusSchema,
  ExecuteTriggerSchema,
  TriggerStatsSchema,
  PaginatedTriggersSchema,
  GetTriggersQuerySchema,
} from './triggerModel'
import { validateRequest } from '@/common/utils/httpHandlers'
import { triggerController } from './triggerController'

export const triggerRegistry = new OpenAPIRegistry()
export const triggerRouter: Router = express.Router()

// Register components with OpenAPI
triggerRegistry.register('Trigger', TriggerSchema)
triggerRegistry.register('CreateTrigger', CreateTriggerSchema)
triggerRegistry.register('UpdateTrigger', UpdateTriggerSchema)
triggerRegistry.register('TriggerStats', TriggerStatsSchema)
triggerRegistry.register('PaginatedTriggers', PaginatedTriggersSchema)

// Common OpenAPI responses
const triggerSuccessResponse = {
  success: true,
  description: 'Success',
  dataSchema: TriggerSchema,
  statusCode: 200,
}

const triggersListSuccessResponse = {
  success: true,
  description: 'Success',
  dataSchema: PaginatedTriggersSchema,
  statusCode: 200,
}

const triggerStatsSuccessResponse = {
  success: true,
  description: 'Success',
  dataSchema: TriggerStatsSchema,
  statusCode: 200,
}

const triggerCreatedResponse = {
  success: true,
  description: 'Created',
  dataSchema: TriggerSchema,
  statusCode: 201,
}

const notFoundResponse = {
  success: false,
  description: 'Not Found',
  dataSchema: z.null(),
  statusCode: 404,
}

const badRequestResponse = {
  success: false,
  description: 'Bad Request',
  dataSchema: z.null(),
  statusCode: 400,
}

// GET /triggers - List all triggers
triggerRegistry.registerPath({
  method: 'get',
  path: '/triggers',
  tags: ['Triggers'],
  summary: 'List all triggers',
  description: 'Retrieve a paginated list of triggers with optional filtering',
  request: {
    query: GetTriggersQuerySchema,
  },
  responses: createOpenApiResponse([triggersListSuccessResponse]),
})

triggerRouter.get('/', triggerController.getTriggers)

// GET /triggers/stats - Get trigger statistics
triggerRegistry.registerPath({
  method: 'get',
  path: '/triggers/stats',
  tags: ['Triggers'],
  summary: 'Get trigger statistics',
  description: 'Retrieve statistics about triggers including counts by type and status',
  responses: createOpenApiResponse([triggerStatsSuccessResponse]),
})

triggerRouter.get('/stats', triggerController.getTriggerStats)

// GET /triggers/:id - Get a trigger by ID
triggerRegistry.registerPath({
  method: 'get',
  path: '/triggers/{id}',
  tags: ['Triggers'],
  summary: 'Get trigger by ID',
  description: 'Retrieve a single trigger by its ID',
  request: { 
    params: GetTriggerSchema.shape.params 
  },
  responses: createOpenApiResponse([triggerSuccessResponse, notFoundResponse]),
})

triggerRouter.get('/:id', validateRequest(GetTriggerSchema.shape.params, 'params'), triggerController.getTrigger)

// POST /triggers - Create a new trigger
triggerRegistry.registerPath({
  method: 'post',
  path: '/triggers',
  tags: ['Triggers'],
  summary: 'Create a new trigger',
  description: 'Create a new trigger with the specified configuration',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateTriggerSchema,
        },
      },
    },
  },
  responses: createOpenApiResponse([triggerCreatedResponse, badRequestResponse]),
})

triggerRouter.post('/', validateRequest(CreateTriggerSchema, 'body'), triggerController.createTrigger)

// PUT /triggers/:id - Update a trigger
triggerRegistry.registerPath({
  method: 'put',
  path: '/triggers/{id}',
  tags: ['Triggers'],
  summary: 'Update a trigger',
  description: 'Update an existing trigger configuration',
  request: {
    params: GetTriggerSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: UpdateTriggerSchema,
        },
      },
    },
  },
  responses: createOpenApiResponse([triggerSuccessResponse, notFoundResponse, badRequestResponse]),
})

triggerRouter.put('/:id', validateRequest(UpdateTriggerSchema, 'body'), triggerController.updateTrigger)

// DELETE /triggers/:id - Delete a trigger
triggerRegistry.registerPath({
  method: 'delete',
  path: '/triggers/{id}',
  tags: ['Triggers'],
  summary: 'Delete a trigger',
  description: 'Delete an existing trigger',
  request: { 
    params: GetTriggerSchema.shape.params 
  },
  responses: createOpenApiResponse([
    { success: true, description: 'Deleted', dataSchema: z.boolean(), statusCode: 200 },
    notFoundResponse
  ]),
})

triggerRouter.delete('/:id', validateRequest(GetTriggerSchema.shape.params, 'params'), triggerController.deleteTrigger)

// PATCH /triggers/:id/status - Toggle trigger status
triggerRegistry.registerPath({
  method: 'patch',
  path: '/triggers/{id}/status',
  tags: ['Triggers'],
  summary: 'Toggle trigger status',
  description: 'Activate or deactivate a trigger',
  request: {
    params: ToggleTriggerStatusSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: ToggleTriggerStatusSchema.shape.body,
        },
      },
    },
  },
  responses: createOpenApiResponse([triggerSuccessResponse, notFoundResponse, badRequestResponse]),
})

triggerRouter.patch('/:id/status', validateRequest(ToggleTriggerStatusSchema.shape.body, 'body'), triggerController.toggleTriggerStatus)

// POST /triggers/:id/execute - Execute a trigger manually
triggerRegistry.registerPath({
  method: 'post',
  path: '/triggers/{id}/execute',
  tags: ['Triggers'],
  summary: 'Execute trigger manually',
  description: 'Manually execute a trigger, bypassing its normal scheduling',
  request: {
    params: ExecuteTriggerSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: ExecuteTriggerSchema.shape.body,
        },
      },
    },
  },
  responses: createOpenApiResponse([
    { success: true, description: 'Executed', dataSchema: z.object({ message: z.string() }), statusCode: 200 },
    notFoundResponse,
    badRequestResponse
  ]),
})

triggerRouter.post('/:id/execute', validateRequest(ExecuteTriggerSchema.shape.body, 'body'), triggerController.executeTrigger)