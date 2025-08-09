import { BaseService } from '@/common/services/baseService'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { StatusCodes } from 'http-status-codes'
import { Octokit } from '@octokit/rest'
import { env } from '@/common/utils/envConfig'
import { logger } from '@/server'
import { githubWebhookRepository } from './githubWebhookRepository'
import type {
  WebhookEvent,
  CreateWebhookEvent,
  BotResponseConfig,
  CreateBotResponseConfig,
  UpdateBotResponseConfig,
  GitHubCommentWebhook,
  GetWebhookEventsQuery
} from './githubWebhookModel'

export class GitHubWebhookService extends BaseService {
  private octokit: Octokit

  constructor() {
    super()
    this.octokit = new Octokit({
      auth: env.GITHUB_TOKEN,
    })
  }

  // Webhook Event processing
  async processIssueCommentWebhook(payload: GitHubCommentWebhook): Promise<ServiceResponse<WebhookEvent>> {
    try {
      // Only process comment creation events
      if (payload.action !== 'created') {
        return ServiceResponse.success('Webhook ignored - not a comment creation event', null)
      }

      const botMentioned = this.checkBotMentioned(payload.comment.body)
      
      // Store the webhook event
      const webhookEvent = await githubWebhookRepository.createWebhookEvent({
        event_type: 'issue_comment',
        action: payload.action,
        repository_full_name: payload.repository.full_name,
        issue_number: payload.issue.number,
        comment_id: payload.comment.id,
        user_login: payload.comment.user.login,
        payload: payload as any,
        bot_mentioned: botMentioned,
      })

      // If bot was mentioned, try to respond
      if (botMentioned) {
        await this.handleBotMention(webhookEvent, payload)
      }

      await githubWebhookRepository.updateWebhookEventProcessed(webhookEvent.id, true)

      return ServiceResponse.success('Webhook processed successfully', webhookEvent)
    } catch (error) {
      logger.error('Error processing issue comment webhook:', error)
      return ServiceResponse.failure(
        'Failed to process webhook',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  private checkBotMentioned(commentBody: string): boolean {
    const botUsername = env.GITHUB_BOT_USERNAME || 'botmaster'
    const mentionPattern = new RegExp(`@${botUsername}\\b`, 'i')
    return mentionPattern.test(commentBody)
  }

  private async handleBotMention(webhookEvent: WebhookEvent, payload: GitHubCommentWebhook): Promise<void> {
    try {
      // Find matching response configurations
      const responseConfigs = await githubWebhookRepository.findMatchingBotResponseConfigs(
        payload.repository.full_name
      )

      if (responseConfigs.length === 0) {
        logger.info('No response configuration found for repository:', payload.repository.full_name)
        return
      }

      // Use the highest priority configuration
      const config = responseConfigs[0]
      
      // Check if any mention keywords match
      const mentionFound = this.checkMentionKeywords(payload.comment.body, config.mention_keywords)
      
      if (!mentionFound && config.mention_keywords.length > 0) {
        logger.info('No matching mention keywords found in comment')
        return
      }

      // Generate response from template
      const responseBody = this.generateResponse(config.response_template, payload)

      // Post comment to GitHub
      await this.postGitHubComment(
        payload.repository.owner.login,
        payload.repository.name,
        payload.issue.number,
        responseBody
      )

      // Update webhook event to mark response as sent
      await githubWebhookRepository.updateWebhookEventProcessed(webhookEvent.id, true, true)

      logger.info(`Bot response posted to ${payload.repository.full_name}#${payload.issue.number}`)
    } catch (error) {
      logger.error('Error handling bot mention:', error)
      throw error
    }
  }

  private checkMentionKeywords(commentBody: string, keywords: string[]): boolean {
    if (keywords.length === 0) return true // No keywords means always respond
    
    const lowerBody = commentBody.toLowerCase()
    return keywords.some(keyword => lowerBody.includes(keyword.toLowerCase()))
  }

  private generateResponse(template: string, payload: GitHubCommentWebhook): string {
    const placeholders = {
      '{user}': payload.comment.user.login,
      '{issue_title}': payload.issue.title,
      '{issue_number}': payload.issue.number.toString(),
      '{repository}': payload.repository.full_name,
      '{comment_url}': payload.comment.html_url,
      '{issue_url}': payload.issue.html_url,
    }

    let response = template
    Object.entries(placeholders).forEach(([placeholder, value]) => {
      response = response.replace(new RegExp(placeholder, 'g'), value)
    })

    return response
  }

  private async postGitHubComment(owner: string, repo: string, issueNumber: number, body: string): Promise<void> {
    try {
      await this.octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body,
      })
    } catch (error) {
      logger.error('Error posting GitHub comment:', error)
      throw new Error(`Failed to post comment to GitHub: ${error.message}`)
    }
  }

  // Webhook Events CRUD
  async getWebhookEvents(filters: GetWebhookEventsQuery): Promise<ServiceResponse<{ events: WebhookEvent[], total: number }>> {
    try {
      const result = await githubWebhookRepository.findWebhookEvents(filters)
      return ServiceResponse.success('Webhook events retrieved successfully', result)
    } catch (error) {
      logger.error('Error retrieving webhook events:', error)
      return ServiceResponse.failure(
        'Failed to retrieve webhook events',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  async getWebhookEventById(id: number): Promise<ServiceResponse<WebhookEvent | null>> {
    try {
      const event = await githubWebhookRepository.findWebhookEventById(id)
      if (!event) {
        return ServiceResponse.failure('Webhook event not found', null, StatusCodes.NOT_FOUND)
      }
      return ServiceResponse.success('Webhook event retrieved successfully', event)
    } catch (error) {
      logger.error('Error retrieving webhook event:', error)
      return ServiceResponse.failure(
        'Failed to retrieve webhook event',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  // Bot Response Config CRUD
  async createBotResponseConfig(data: CreateBotResponseConfig): Promise<ServiceResponse<BotResponseConfig>> {
    try {
      const config = await githubWebhookRepository.createBotResponseConfig(data)
      return ServiceResponse.success('Bot response configuration created successfully', config)
    } catch (error) {
      logger.error('Error creating bot response config:', error)
      return ServiceResponse.failure(
        'Failed to create bot response configuration',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  async getBotResponseConfigs(): Promise<ServiceResponse<BotResponseConfig[]>> {
    try {
      const configs = await githubWebhookRepository.findAllBotResponseConfigs()
      return ServiceResponse.success('Bot response configurations retrieved successfully', configs)
    } catch (error) {
      logger.error('Error retrieving bot response configs:', error)
      return ServiceResponse.failure(
        'Failed to retrieve bot response configurations',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  async getBotResponseConfigById(id: number): Promise<ServiceResponse<BotResponseConfig | null>> {
    try {
      const config = await githubWebhookRepository.findBotResponseConfigById(id)
      if (!config) {
        return ServiceResponse.failure('Bot response configuration not found', null, StatusCodes.NOT_FOUND)
      }
      return ServiceResponse.success('Bot response configuration retrieved successfully', config)
    } catch (error) {
      logger.error('Error retrieving bot response config:', error)
      return ServiceResponse.failure(
        'Failed to retrieve bot response configuration',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  async updateBotResponseConfig(id: number, data: UpdateBotResponseConfig): Promise<ServiceResponse<BotResponseConfig | null>> {
    try {
      const config = await githubWebhookRepository.updateBotResponseConfig(id, data)
      if (!config) {
        return ServiceResponse.failure('Bot response configuration not found', null, StatusCodes.NOT_FOUND)
      }
      return ServiceResponse.success('Bot response configuration updated successfully', config)
    } catch (error) {
      logger.error('Error updating bot response config:', error)
      return ServiceResponse.failure(
        'Failed to update bot response configuration',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  async deleteBotResponseConfig(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const deleted = await githubWebhookRepository.deleteBotResponseConfig(id)
      if (!deleted) {
        return ServiceResponse.failure('Bot response configuration not found', false, StatusCodes.NOT_FOUND)
      }
      return ServiceResponse.success('Bot response configuration deleted successfully', true)
    } catch (error) {
      logger.error('Error deleting bot response config:', error)
      return ServiceResponse.failure(
        'Failed to delete bot response configuration',
        false,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }
}

export const githubWebhookService = new GitHubWebhookService()