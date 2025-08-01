import express, { type Router } from 'express'
import { workerController } from './workerController'
import { CreateWorkerSchema, WorkerKeyRouteParamsSchema, WorkerRouteParamsSchema, UpdateWorkerSchema, UpdateWorkerStatusSchema } from './workerModel'
import { validateRequest } from '@/common/utils/httpHandlers'
import { workerInstallationRouterV1 } from './installations/workerInstallationRoutes'

export const workersRouterV1: Router = express.Router({})

// Create worker
workersRouterV1.post('/', validateRequest(CreateWorkerSchema, 'body'), workerController.create)

// List workers with pagination and filters
workersRouterV1.get('/', workerController.getAll)

// Get worker by key
workersRouterV1.get('/:key', validateRequest(WorkerKeyRouteParamsSchema, 'params'), workerController.getByKey)

// Update worker
workersRouterV1.put('/:id', validateRequest(UpdateWorkerSchema, 'body'), workerController.update)

// Delete worker
workersRouterV1.delete('/:id', workerController.delete)

// Update worker status
workersRouterV1.patch('/:id/status', validateRequest(UpdateWorkerStatusSchema, 'body'), workerController.updateStatus)

// Worker installations
workersRouterV1.use('/installations', workerInstallationRouterV1)
