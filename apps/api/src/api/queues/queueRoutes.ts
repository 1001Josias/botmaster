import express, { type Router } from 'express'
import { queueController } from './queueController'
import { 
  CreateQueueSchema, 
  UpdateQueueSchema,
  QueueRouteParamsSchema,
  QueueKeyRouteParamsSchema,
  GetQueuesRouteQuerySchema
} from './queueModel'
import { validateRequest } from '@/common/utils/httpHandlers'

export const queuesRouterV1: Router = express.Router({})

// Queue CRUD operations
queuesRouterV1.post('/', validateRequest(CreateQueueSchema, 'body'), queueController.create)
queuesRouterV1.get('/', validateRequest(GetQueuesRouteQuerySchema, 'query'), queueController.getAll)
queuesRouterV1.get('/key/:key', validateRequest(QueueKeyRouteParamsSchema, 'params'), queueController.getByKey)
queuesRouterV1.get('/:id', validateRequest(QueueRouteParamsSchema, 'params'), queueController.getById)
queuesRouterV1.put('/:id', validateRequest(QueueRouteParamsSchema, 'params'), validateRequest(UpdateQueueSchema, 'body'), queueController.update)
queuesRouterV1.delete('/:id', validateRequest(QueueRouteParamsSchema, 'params'), queueController.delete)

// Queue control operations  
queuesRouterV1.post('/:id/pause', validateRequest(QueueRouteParamsSchema, 'params'), queueController.pause)
queuesRouterV1.post('/:id/resume', validateRequest(QueueRouteParamsSchema, 'params'), queueController.resume)

// Queue stats
queuesRouterV1.get('/:id/stats', validateRequest(QueueRouteParamsSchema, 'params'), queueController.getStats)