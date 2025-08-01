import express, { type Router } from 'express'
import { queueItemController } from './queueItemController'
import { 
  CreateQueueItemSchema, 
  UpdateQueueItemSchema,
  QueueItemRouteParamsSchema,
  GetQueueItemsRouteQuerySchema,
  ExportOptionsSchema
} from './queueItemModel'
import { validateRequest } from '@/common/utils/httpHandlers'

export const queueItemsRouterV1: Router = express.Router({})

// Queue Item CRUD operations
queueItemsRouterV1.post('/', validateRequest(CreateQueueItemSchema, 'body'), queueItemController.create)
queueItemsRouterV1.get('/', validateRequest(GetQueueItemsRouteQuerySchema, 'query'), queueItemController.getAll)
queueItemsRouterV1.get('/:id', validateRequest(QueueItemRouteParamsSchema, 'params'), queueItemController.getById)
queueItemsRouterV1.put('/:id', validateRequest(QueueItemRouteParamsSchema, 'params'), validateRequest(UpdateQueueItemSchema, 'body'), queueItemController.update)
queueItemsRouterV1.delete('/:id', validateRequest(QueueItemRouteParamsSchema, 'params'), queueItemController.delete)

// Queue Item control operations
queueItemsRouterV1.post('/:id/retry', validateRequest(QueueItemRouteParamsSchema, 'params'), queueItemController.retry)
queueItemsRouterV1.post('/:id/cancel', validateRequest(QueueItemRouteParamsSchema, 'params'), queueItemController.cancel)

// Export functionality
queueItemsRouterV1.post('/export', validateRequest(ExportOptionsSchema, 'body'), queueItemController.export)