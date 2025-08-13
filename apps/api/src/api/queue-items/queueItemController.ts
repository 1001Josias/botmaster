import { NextFunction, Request } from 'express'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { QueueItemService } from './queueItemService'
import { 
  CreateQueueItemDto, 
  UpdateQueueItemDto, 
  QueueItemResponseDto,
  QueueItemsResponseDto,
  QueueItemFiltersDto,
  ExportOptionsDto,
  ExportResultDto,
  QueueItemStatusType
} from './queueItemModel'
import { ResponseCustom } from '@/common/utils/httpHandlers'
import { BaseController } from '@/common/controllers/baseController'
import { QueueItemResponseMessages } from './queueItemResponseMessages'

export class QueueItemController extends BaseController<QueueItemService> {
  constructor(service: QueueItemService = new QueueItemService()) {
    super(service)
  }

  public create = async (
    req: Request<CreateQueueItemDto>,
    res: ResponseCustom<QueueItemResponseDto, CreateQueueItemDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueItemResponseMessages>(req, async (queueItemService) => {
        const queueItem = res.locals.validatedData.body as CreateQueueItemDto
        const createdQueueItem = await queueItemService.create(queueItem)
        return handleServiceResponse(createdQueueItem, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public getById = async (
    req: Request<{ id: string }>,
    res: ResponseCustom<QueueItemResponseDto, { id: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueItemResponseMessages>(req, async (queueItemService) => {
        const { id } = req.params
        const queueItem = await queueItemService.getById(parseInt(id))
        return handleServiceResponse(queueItem, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public getAll = async (
    req: Request<{}, {}, {}, {
      page?: number
      pageSize?: number
      status?: QueueItemStatusType[]
      queueId?: number
      workerId?: string
      jobId?: string
      dateFrom?: string
      dateTo?: string
      searchTerm?: string
    }>,
    res: ResponseCustom<QueueItemsResponseDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueItemResponseMessages>(req, async (queueItemService) => {
        const {
          page = 1,
          pageSize = 20,
          status,
          queueId,
          workerId,
          jobId,
          dateFrom,
          dateTo,
          searchTerm
        } = req.query

        const filters: QueueItemFiltersDto = {
          page: Number(page),
          pageSize: Number(pageSize),
          status,
          workerId,
          jobId,
          dateFrom,
          dateTo,
          searchTerm,
        }

        const queueItems = await queueItemService.getAll(filters)
        return handleServiceResponse(queueItems, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public update = async (
    req: Request<{ id: string }, {}, UpdateQueueItemDto>,
    res: ResponseCustom<QueueItemResponseDto, { id: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueItemResponseMessages>(req, async (queueItemService) => {
        const { id } = req.params
        const updates = res.locals.validatedData.body as UpdateQueueItemDto
        const updatedQueueItem = await queueItemService.update(parseInt(id), updates)
        return handleServiceResponse(updatedQueueItem, res)
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
      return await this.context<QueueItemResponseMessages>(req, async (queueItemService) => {
        const { id } = req.params
        const result = await queueItemService.delete(parseInt(id))
        return handleServiceResponse(result, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public retry = async (
    req: Request<{ id: string }>,
    res: ResponseCustom<QueueItemResponseDto, { id: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueItemResponseMessages>(req, async (queueItemService) => {
        const { id } = req.params
        const retriedQueueItem = await queueItemService.retry(parseInt(id))
        return handleServiceResponse(retriedQueueItem, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public cancel = async (
    req: Request<{ id: string }>,
    res: ResponseCustom<QueueItemResponseDto, { id: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueItemResponseMessages>(req, async (queueItemService) => {
        const { id } = req.params
        const cancelledQueueItem = await queueItemService.cancel(parseInt(id))
        return handleServiceResponse(cancelledQueueItem, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public export = async (
    req: Request<{}, {}, ExportOptionsDto>,
    res: ResponseCustom<ExportResultDto, {}>,
    next: NextFunction
  ) => {
    try {
      return await this.context<QueueItemResponseMessages>(req, async (queueItemService) => {
        const exportOptions = res.locals.validatedData.body as ExportOptionsDto
        const exportResult = await queueItemService.export(exportOptions)
        return handleServiceResponse(exportResult, res)
      })
    } catch (err) {
      next(err)
    }
  }
}

export const queueItemController = new QueueItemController()