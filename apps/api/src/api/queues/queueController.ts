import { NextFunction, Request } from 'express'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { QueueService } from './queueService'
import { 
  CreateQueueDto, 
  UpdateQueueDto, 
  QueueResponseDto,
  QueueStatsDto,
  QueueStatusType
} from './queueModel'
import { ResponseCustom } from '@/common/utils/httpHandlers'
import { BaseController } from '@/common/controllers/baseController'
import { QueueResponseMessages } from './queueResponseMessages'

export class QueueController extends BaseController<QueueService> {
  constructor(service: QueueService = new QueueService()) {
    super(service)
  }

  public create = async (
    req: Request<CreateQueueDto>,
    res: ResponseCustom<QueueResponseDto, CreateQueueDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueResponseMessages>(req, async (queueService) => {
        const queue = res.locals.validatedData.body as CreateQueueDto
        const createdQueue = await queueService.create(queue)
        return handleServiceResponse(createdQueue, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public getById = async (
    req: Request<{ id: string }>,
    res: ResponseCustom<QueueResponseDto, { id: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueResponseMessages>(req, async (queueService) => {
        const { id } = req.params
        const queue = await queueService.getById(parseInt(id))
        return handleServiceResponse(queue, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public getByKey = async (
    req: Request<{ key: string }>,
    res: ResponseCustom<QueueResponseDto, { key: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueResponseMessages>(req, async (queueService) => {
        const { key } = req.params
        const queue = await queueService.getByKey(key)
        return handleServiceResponse(queue, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public getAll = async (
    req: Request<{}, {}, {}, {
      page?: number
      limit?: number
      status?: QueueStatusType
      folderKey?: string
      search?: string
    }>,
    res: ResponseCustom<{ queues: QueueResponseDto[], total: number }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueResponseMessages>(req, async (queueService) => {
        const { page = 1, limit = 20, status, folderKey, search } = req.query
        const queues = await queueService.getAll({
          page: Number(page),
          limit: Number(limit),
          status,
          folderKey,
          search,
        })
        return handleServiceResponse(queues, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public update = async (
    req: Request<{ id: string }, {}, UpdateQueueDto>,
    res: ResponseCustom<QueueResponseDto, { id: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueResponseMessages>(req, async (queueService) => {
        const { id } = req.params
        const updates = res.locals.validatedData.body as UpdateQueueDto
        const updatedQueue = await queueService.update(parseInt(id), updates)
        return handleServiceResponse(updatedQueue, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public delete = async (
    req: Request<{ id: string }>,
    res: ResponseCustom<null, { id: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueResponseMessages>(req, async (queueService) => {
        const { id } = req.params
        const result = await queueService.delete(parseInt(id))
        return handleServiceResponse(result, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public pause = async (
    req: Request<{ id: string }>,
    res: ResponseCustom<QueueResponseDto, { id: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueResponseMessages>(req, async (queueService) => {
        const { id } = req.params
        const pausedQueue = await queueService.pause(parseInt(id))
        return handleServiceResponse(pausedQueue, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public resume = async (
    req: Request<{ id: string }>,
    res: ResponseCustom<QueueResponseDto, { id: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueResponseMessages>(req, async (queueService) => {
        const { id } = req.params
        const resumedQueue = await queueService.resume(parseInt(id))
        return handleServiceResponse(resumedQueue, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public getStats = async (
    req: Request<{ id: string }>,
    res: ResponseCustom<QueueStatsDto, { id: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueResponseMessages>(req, async (queueService) => {
        const { id } = req.params
        const stats = await queueService.getStats(parseInt(id))
        return handleServiceResponse(stats, res)
      })
    } catch (err) {
      next(err)
    }
  }
}

export const queueController = new QueueController()