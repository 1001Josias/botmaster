import express, { type Router } from 'express'
import { workerController } from './workerController'
import { CreateWorkerSchema } from './workerModel'
import { validateRequest } from '@/common/utils/httpHandlers'

export const workersRouterV1: Router = express.Router({})

workersRouterV1.post('/', validateRequest(CreateWorkerSchema, 'body'), workerController.createWorker)
