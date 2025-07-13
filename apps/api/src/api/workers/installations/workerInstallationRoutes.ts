import { Router } from 'express'
import { workerInstallationController } from './workerInstallationController'
import { validateRequest } from '@/common/utils/httpHandlers'
import { WorkerInstallationSchema } from './workerInstallationModel'

export const workerInstallationRouterV1: Router = Router({})

workerInstallationRouterV1.post(
  '/',
  validateRequest(WorkerInstallationSchema, 'body'),
  workerInstallationController.install
)
