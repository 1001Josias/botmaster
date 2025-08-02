import type { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { BaseController } from '@/common/controllers/baseController'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { githubWebhookService, GitHubWebhookService } from './githubWebhookService'
import { env } from '@/common/utils/envConfig'
import type {
  GitHubCommentWebhook,
  CreateBotResponseConfig,
  UpdateBotResponseConfig,
  GetWebhookEventsQuery
} from './githubWebhookModel'

class GitHubWebhookController extends BaseController<GitHubWebhookService> {
  constructor() {
    super(githubWebhookService)
  }
  
  // Webhook endpoint - receives GitHub webhook events
  public handleWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      // Verify webhook signature if secret is configured
      if (env.GITHUB_WEBHOOK_SECRET) {
        const signature = req.headers['x-hub-signature-256'] as string
        if (!this.verifyWebhookSignature(JSON.stringify(req.body), signature)) {
          res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: 'Invalid webhook signature',
            responseObject: null,
            statusCode: StatusCodes.UNAUTHORIZED
          })
          return
        }
      }

      const eventType = req.headers['x-github-event'] as string
      
      // Only handle issue comment events for now
      if (eventType !== 'issue_comment') {
        res.status(StatusCodes.OK).json({
          success: true,
          message: 'Event type not handled',
          responseObject: { eventType },
          statusCode: StatusCodes.OK
        })
        return
      }

      const payload = req.body as GitHubCommentWebhook
      const serviceResponse = await this.service.processIssueCommentWebhook(payload)
      
      handleServiceResponse(serviceResponse, res)
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error processing webhook',
        responseObject: null,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
      })
    }
  }

  private verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const expectedSignature = 'sha256=' + createHmac('sha256', env.GITHUB_WEBHOOK_SECRET!)
        .update(payload)
        .digest('hex')
      
      return timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      )
    } catch (error) {
      return false
    }
  }

  // Webhook Events CRUD endpoints
  public getWebhookEvents = async (req: Request<{}, {}, {}, GetWebhookEventsQuery>, res: Response): Promise<void> => {
    const filters = req.query
    const serviceResponse = await this.service.getWebhookEvents(filters)
    handleServiceResponse(serviceResponse, res)
  }

  public getWebhookEventById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid webhook event ID',
        responseObject: null,
        statusCode: StatusCodes.BAD_REQUEST
      })
      return
    }

    const serviceResponse = await this.service.getWebhookEventById(id)
    handleServiceResponse(serviceResponse, res)
  }

  // Bot Response Config CRUD endpoints
  public createBotResponseConfig = async (req: Request<{}, {}, CreateBotResponseConfig>, res: Response): Promise<void> => {
    const data = req.body
    const serviceResponse = await this.service.createBotResponseConfig(data)
    handleServiceResponse(serviceResponse, res)
  }

  public getBotResponseConfigs = async (req: Request, res: Response): Promise<void> => {
    const serviceResponse = await this.service.getBotResponseConfigs()
    handleServiceResponse(serviceResponse, res)
  }

  public getBotResponseConfigById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bot response config ID',
        responseObject: null,
        statusCode: StatusCodes.BAD_REQUEST
      })
      return
    }

    const serviceResponse = await this.service.getBotResponseConfigById(id)
    handleServiceResponse(serviceResponse, res)
  }

  public updateBotResponseConfig = async (req: Request<{ id: string }, {}, UpdateBotResponseConfig>, res: Response): Promise<void> => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bot response config ID',
        responseObject: null,
        statusCode: StatusCodes.BAD_REQUEST
      })
      return
    }

    const data = req.body
    const serviceResponse = await this.service.updateBotResponseConfig(id, data)
    handleServiceResponse(serviceResponse, res)
  }

  public deleteBotResponseConfig = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bot response config ID',
        responseObject: null,
        statusCode: StatusCodes.BAD_REQUEST
      })
      return
    }

    const serviceResponse = await this.service.deleteBotResponseConfig(id)
    handleServiceResponse(serviceResponse, res)
  }
}

export const githubWebhookController = new GitHubWebhookController()