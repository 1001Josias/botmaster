import express, { type Router } from 'express'
import { githubWebhookController } from './githubWebhookController'
import { 
  CreateBotResponseConfigSchema, 
  UpdateBotResponseConfigSchema,
  WebhookEventRouteParamsSchema,
  BotResponseConfigRouteParamsSchema,
  GetWebhookEventsQuerySchema 
} from './githubWebhookModel'
import { validateRequest } from '@/common/utils/httpHandlers'

export const githubWebhooksRouterV1: Router = express.Router({})

// Webhook endpoint - no authentication needed as GitHub will call this
githubWebhooksRouterV1.post('/webhook', githubWebhookController.handleWebhook)

// Webhook Events endpoints
githubWebhooksRouterV1.get('/events', 
  validateRequest(GetWebhookEventsQuerySchema, 'query'), 
  githubWebhookController.getWebhookEvents
)

githubWebhooksRouterV1.get('/events/:id', 
  validateRequest(WebhookEventRouteParamsSchema, 'params'), 
  githubWebhookController.getWebhookEventById
)

// Bot Response Config endpoints
githubWebhooksRouterV1.post('/configs', 
  validateRequest(CreateBotResponseConfigSchema, 'body'), 
  githubWebhookController.createBotResponseConfig
)

githubWebhooksRouterV1.get('/configs', 
  githubWebhookController.getBotResponseConfigs
)

githubWebhooksRouterV1.get('/configs/:id', 
  validateRequest(BotResponseConfigRouteParamsSchema, 'params'), 
  githubWebhookController.getBotResponseConfigById
)

githubWebhooksRouterV1.put('/configs/:id', 
  validateRequest(BotResponseConfigRouteParamsSchema, 'params'),
  validateRequest(UpdateBotResponseConfigSchema, 'body'), 
  githubWebhookController.updateBotResponseConfig
)

githubWebhooksRouterV1.delete('/configs/:id', 
  validateRequest(BotResponseConfigRouteParamsSchema, 'params'), 
  githubWebhookController.deleteBotResponseConfig
)