import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { commonValidations } from '../../common/utils/commonValidation'

extendZodWithOpenApi(z)

const webhookId = commonValidations.id.describe('The unique identifier of the webhook event')
const timestamp = commonValidations.timestamp

// GitHub webhook event schema for issue comments
export const GitHubCommentWebhookSchema = z.object({
  action: z.enum(['created', 'edited', 'deleted']).describe('The action performed on the comment'),
  issue: z.object({
    id: z.number().describe('The unique identifier of the issue'),
    number: z.number().describe('The issue number'),
    title: z.string().describe('The title of the issue'),
    body: z.string().nullable().describe('The body of the issue'),
    html_url: z.string().url().describe('The URL of the issue'),
    state: z.enum(['open', 'closed']).describe('The state of the issue'),
    user: z.object({
      login: z.string().describe('The username of the issue author'),
      id: z.number().describe('The unique identifier of the user'),
      avatar_url: z.string().url().describe('The avatar URL of the user'),
      html_url: z.string().url().describe('The profile URL of the user'),
    }),
  }),
  comment: z.object({
    id: z.number().describe('The unique identifier of the comment'),
    body: z.string().describe('The body of the comment'),
    html_url: z.string().url().describe('The URL of the comment'),
    user: z.object({
      login: z.string().describe('The username of the comment author'),
      id: z.number().describe('The unique identifier of the user'),
      avatar_url: z.string().url().describe('The avatar URL of the user'),
      html_url: z.string().url().describe('The profile URL of the user'),
    }),
    created_at: z.string().describe('The creation date of the comment'),
    updated_at: z.string().describe('The last update date of the comment'),
  }),
  repository: z.object({
    id: z.number().describe('The unique identifier of the repository'),
    name: z.string().describe('The name of the repository'),
    full_name: z.string().describe('The full name of the repository'),
    html_url: z.string().url().describe('The URL of the repository'),
    owner: z.object({
      login: z.string().describe('The username of the repository owner'),
      id: z.number().describe('The unique identifier of the owner'),
      avatar_url: z.string().url().describe('The avatar URL of the owner'),
      html_url: z.string().url().describe('The profile URL of the owner'),
    }),
  }),
}).describe('GitHub webhook payload for issue comment events')

// Schema for storing webhook events in the database
export const WebhookEventSchema = z.object({
  id: webhookId,
  event_type: z.string().describe('The type of webhook event (e.g., issue_comment)'),
  action: z.string().describe('The action performed (e.g., created, edited)'),
  repository_full_name: z.string().describe('The full name of the repository'),
  issue_number: z.number().nullable().describe('The issue number if applicable'),
  comment_id: z.number().nullable().describe('The comment ID if applicable'),
  user_login: z.string().describe('The username who triggered the event'),
  payload: z.record(z.any()).describe('The full webhook payload as JSON'),
  processed: z.boolean().default(false).describe('Whether the webhook has been processed'),
  bot_mentioned: z.boolean().default(false).describe('Whether the bot was mentioned'),
  response_sent: z.boolean().default(false).describe('Whether a response was sent'),
  created_at: timestamp,
  updated_at: timestamp,
}).openapi('WebhookEvent')

// Schema for bot responses/configurations
export const BotResponseConfigSchema = z.object({
  id: commonValidations.id,
  repository_pattern: z.string().describe('Pattern to match repositories (e.g., "1001Josias/*" or "*")'),
  mention_keywords: z.array(z.string()).describe('Keywords that trigger bot responses when mentioned'),
  response_template: z.string().describe('Template for bot responses with placeholders'),
  enabled: z.boolean().default(true).describe('Whether this response configuration is enabled'),
  priority: z.number().min(0).max(10).default(5).describe('Priority of this response (higher = more priority)'),
  created_at: timestamp,
  updated_at: timestamp,
}).openapi('BotResponseConfig')

// Request/Response schemas for API endpoints
export const CreateWebhookEventSchema = z.object({
  event_type: z.string(),
  action: z.string(),
  repository_full_name: z.string(),
  issue_number: z.number().nullable(),
  comment_id: z.number().nullable(),
  user_login: z.string(),
  payload: z.record(z.any()),
  bot_mentioned: z.boolean().default(false),
}).openapi('CreateWebhookEvent')

export const CreateBotResponseConfigSchema = z.object({
  repository_pattern: z.string(),
  mention_keywords: z.array(z.string()),
  response_template: z.string(),
  enabled: z.boolean().default(true),
  priority: z.number().min(0).max(10).default(5),
}).openapi('CreateBotResponseConfig')

export const UpdateBotResponseConfigSchema = CreateBotResponseConfigSchema.partial().openapi('UpdateBotResponseConfig')

export const WebhookEventRouteParamsSchema = z.object({
  id: webhookId,
}).openapi('WebhookEventRouteParams')

export const BotResponseConfigRouteParamsSchema = z.object({
  id: commonValidations.id,
}).openapi('BotResponseConfigRouteParams')

export const GetWebhookEventsQuerySchema = z.object({
  repository: z.string().optional().describe('Filter by repository full name'),
  event_type: z.string().optional().describe('Filter by event type'),
  processed: z.boolean().optional().describe('Filter by processed status'),
  bot_mentioned: z.boolean().optional().describe('Filter by bot mentioned status'),
  limit: z.coerce.number().min(1).max(100).default(20).describe('Number of records to return'),
  offset: z.coerce.number().min(0).default(0).describe('Number of records to skip'),
}).openapi('GetWebhookEventsQuery')

// Type exports
export type GitHubCommentWebhook = z.infer<typeof GitHubCommentWebhookSchema>
export type WebhookEvent = z.infer<typeof WebhookEventSchema>
export type BotResponseConfig = z.infer<typeof BotResponseConfigSchema>
export type CreateWebhookEvent = z.infer<typeof CreateWebhookEventSchema>
export type CreateBotResponseConfig = z.infer<typeof CreateBotResponseConfigSchema>
export type UpdateBotResponseConfig = z.infer<typeof UpdateBotResponseConfigSchema>
export type GetWebhookEventsQuery = z.infer<typeof GetWebhookEventsQuerySchema>