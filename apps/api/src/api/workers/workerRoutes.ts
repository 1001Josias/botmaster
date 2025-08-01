import express, { type Router } from 'express'
import { workerController } from './workerController'
import { CreateWorkerSchema, WorkerKeyRouteParamsSchema, GetWorkersRouteQuerySchema } from './workerModel'
import { validateRequest } from '@/common/utils/httpHandlers'
import { workerInstallationRouterV1 } from './installations/workerInstallationRoutes'

export const workersRouterV1: Router = express.Router({})

workersRouterV1.get('/', validateRequest(GetWorkersRouteQuerySchema, 'query'), workerController.getAll)
workersRouterV1.post('/', validateRequest(CreateWorkerSchema, 'body'), workerController.create)
workersRouterV1.get('/:key', validateRequest(WorkerKeyRouteParamsSchema, 'params'), workerController.getByKey)
workersRouterV1.use('/installations', workerInstallationRouterV1)
