import express, { type Router } from 'express'
import { workerController } from './workerController'
import { WorkerCreateSchema } from './workerModel'
import { validateRequest } from '@/common/utils/httpHandlers'

export const workersRouterV1: Router = express.Router({})

workersRouterV1.post('/', validateRequest(WorkerCreateSchema, 'body'), workerController.createWorker)
