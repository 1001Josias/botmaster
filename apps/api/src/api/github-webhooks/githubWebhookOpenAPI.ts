import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { createOpenApiResponse } from '@/api-docs/openAPIResponseBuilders'
import { 
  GitHubCommentWebhookSchema,
  WebhookEventSchema,
  BotResponseConfigSchema,
  CreateBotResponseConfigSchema,
  UpdateBotResponseConfigSchema,
  GetWebhookEventsQuerySchema,
  WebhookEventRouteParamsSchema,
  BotResponseConfigRouteParamsSchema
} from './githubWebhookModel'

export const githubWebhookRegistry = new OpenAPIRegistry()

// Webhook endpoint
githubWebhookRegistry.registerPath({
  method: 'post',
  path: '/github-webhooks/webhook',
  description: 'GitHub webhook endpoint for receiving issue comment events',
  summary: 'Receive GitHub webhook events',
  request: {
    body: {
      description: 'GitHub issue comment webhook payload',
      content: {
        'application/json': {
          schema: GitHubCommentWebhookSchema,
        },
      },
    },
    headers: [
      {
        name: 'x-github-event',
        description: 'GitHub event type',
        required: true,
        schema: { type: 'string', example: 'issue_comment' },
      },
      {
        name: 'x-hub-signature-256',
        description: 'GitHub webhook signature for verification',
        required: false,
        schema: { type: 'string', example: 'sha256=...' },
      },
    ],
  },
  responses: createOpenApiResponse([
    {
      statusCode: 200,
      description: 'Webhook processed successfully',
      schema: WebhookEventSchema,
    },
    {
      statusCode: 401,
      description: 'Invalid webhook signature',
    },
  ]),
  tags: ['GitHub Webhooks'],
})

// Webhook Events endpoints
githubWebhookRegistry.registerPath({
  method: 'get',
  path: '/github-webhooks/events',
  description: 'Get webhook events with filtering and pagination',
  summary: 'List webhook events',
  request: {
    query: GetWebhookEventsQuerySchema,
  },
  responses: createOpenApiResponse([
    {
      statusCode: 200,
      description: 'Webhook events retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          events: { type: 'array', items: WebhookEventSchema },
          total: { type: 'number' },
        },
      },
    },
  ]),
  tags: ['GitHub Webhooks'],
})

githubWebhookRegistry.registerPath({
  method: 'get',
  path: '/github-webhooks/events/{id}',
  description: 'Get a specific webhook event by ID',
  summary: 'Get webhook event by ID',
  request: {
    params: WebhookEventRouteParamsSchema,
  },
  responses: createOpenApiResponse([
    {
      statusCode: 200,
      description: 'Webhook event retrieved successfully',
      schema: WebhookEventSchema,
    },
    {
      statusCode: 404,
      description: 'Webhook event not found',
    },
  ]),
  tags: ['GitHub Webhooks'],
})

// Bot Response Config endpoints
githubWebhookRegistry.registerPath({
  method: 'post',
  path: '/github-webhooks/configs',
  description: 'Create a new bot response configuration',
  summary: 'Create bot response config',
  request: {
    body: {
      description: 'Bot response configuration data',
      content: {
        'application/json': {
          schema: CreateBotResponseConfigSchema,
        },
      },
    },
  },
  responses: createOpenApiResponse([
    {
      statusCode: 201,
      description: 'Bot response configuration created successfully',
      schema: BotResponseConfigSchema,
    },
  ]),
  tags: ['Bot Response Configs'],
})

githubWebhookRegistry.registerPath({
  method: 'get',
  path: '/github-webhooks/configs',
  description: 'Get all bot response configurations',
  summary: 'List bot response configs',
  responses: createOpenApiResponse([
    {
      statusCode: 200,
      description: 'Bot response configurations retrieved successfully',
      schema: {
        type: 'array',
        items: BotResponseConfigSchema,
      },
    },
  ]),
  tags: ['Bot Response Configs'],
})

githubWebhookRegistry.registerPath({
  method: 'get',
  path: '/github-webhooks/configs/{id}',
  description: 'Get a specific bot response configuration by ID',
  summary: 'Get bot response config by ID',
  request: {
    params: BotResponseConfigRouteParamsSchema,
  },
  responses: createOpenApiResponse([
    {
      statusCode: 200,
      description: 'Bot response configuration retrieved successfully',
      schema: BotResponseConfigSchema,
    },
    {
      statusCode: 404,
      description: 'Bot response configuration not found',
    },
  ]),
  tags: ['Bot Response Configs'],
})

githubWebhookRegistry.registerPath({
  method: 'put',
  path: '/github-webhooks/configs/{id}',
  description: 'Update a bot response configuration',
  summary: 'Update bot response config',
  request: {
    params: BotResponseConfigRouteParamsSchema,
    body: {
      description: 'Updated bot response configuration data',
      content: {
        'application/json': {
          schema: UpdateBotResponseConfigSchema,
        },
      },
    },
  },
  responses: createOpenApiResponse([
    {
      statusCode: 200,
      description: 'Bot response configuration updated successfully',
      schema: BotResponseConfigSchema,
    },
    {
      statusCode: 404,
      description: 'Bot response configuration not found',
    },
  ]),
  tags: ['Bot Response Configs'],
})

githubWebhookRegistry.registerPath({
  method: 'delete',
  path: '/github-webhooks/configs/{id}',
  description: 'Delete a bot response configuration',
  summary: 'Delete bot response config',
  request: {
    params: BotResponseConfigRouteParamsSchema,
  },
  responses: createOpenApiResponse([
    {
      statusCode: 200,
      description: 'Bot response configuration deleted successfully',
      schema: { type: 'boolean' },
    },
    {
      statusCode: 404,
      description: 'Bot response configuration not found',
    },
  ]),
  tags: ['Bot Response Configs'],
})