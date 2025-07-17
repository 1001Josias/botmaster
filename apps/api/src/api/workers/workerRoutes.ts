import express, { type Router } from 'express'
import { workerController } from './workerController'
import { CreateWorkerSchema, WorkerKeyRouteParamsSchema } from './workerModel'
import { validateRequest } from '@/common/utils/httpHandlers'

export const workersRouterV1: Router = express.Router({})

workersRouterV1.post('/', validateRequest(CreateWorkerSchema, 'body'), workerController.create)
workersRouterV1.get('/:key', validateRequest(WorkerKeyRouteParamsSchema, 'params'), workerController.getByKey)
