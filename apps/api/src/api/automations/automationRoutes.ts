import express, { type Router } from 'express'
import { automationController } from './automationController'
import { AutomationCreateSchema } from './automationModel'
import { validateRequest } from '@/common/utils/httpHandlers'

export const automationsRouterV1: Router = express.Router({})

automationsRouterV1.post('/', validateRequest(AutomationCreateSchema, 'body'), automationController.createAutomation)
