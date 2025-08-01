import { QueueItemRepository } from './queueItemRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { 
  QueueItemResponseDto, 
  CreateQueueItemDto, 
  UpdateQueueItemDto,
  QueueItemsResponseDto,
  QueueItemFiltersDto,
  ExportOptionsDto,
  ExportResultDto
} from './queueItemModel'
import { BaseService } from '@/common/services/baseService'
import { queueItemConstraintErrorMessages, QueueItemResponseMessages } from './queueItemResponseMessages'
import { ServiceResponseObjectError } from '@/common/services/services'

export interface IQueueItemService {
  create(queueItem: CreateQueueItemDto): Promise<ServiceResponse<QueueItemResponseDto | ServiceResponseObjectError | null>>
  getById(id: number): Promise<ServiceResponse<QueueItemResponseDto | ServiceResponseObjectError | null>>
  getAll(filters: QueueItemFiltersDto): Promise<ServiceResponse<QueueItemsResponseDto | ServiceResponseObjectError | null>>
  update(id: number, updates: UpdateQueueItemDto): Promise<ServiceResponse<QueueItemResponseDto | ServiceResponseObjectError | null>>
  delete(id: number): Promise<ServiceResponse<null | ServiceResponseObjectError>>
  retry(id: number): Promise<ServiceResponse<QueueItemResponseDto | ServiceResponseObjectError | null>>
  cancel(id: number): Promise<ServiceResponse<QueueItemResponseDto | ServiceResponseObjectError | null>>
  export(options: ExportOptionsDto): Promise<ServiceResponse<ExportResultDto | ServiceResponseObjectError | null>>
}

export class QueueItemService extends BaseService implements IQueueItemService {
  constructor() {
    super()
  }

  async create(
    queueItem: CreateQueueItemDto
  ): Promise<ServiceResponse<QueueItemResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueItemRepository.session(this.context, async (queueItemRepository) => {
        const createdQueueItem = await queueItemRepository.create(queueItem)
        return this.createdSuccessfully(QueueItemResponseMessages.createdSuccessfullyMessage, createdQueueItem)
      })
    } catch (error) {
      return this.handleError(error, queueItemConstraintErrorMessages, QueueItemResponseMessages.notFoundErrorMessage)
    }
  }

  async getById(id: number): Promise<ServiceResponse<QueueItemResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueItemRepository.session(this.context, async (queueItemRepository) => {
        const queueItem = await queueItemRepository.getById(id)
        if (!queueItem) {
          return this.notFoundError(QueueItemResponseMessages.notFoundErrorMessage)
        }
        return this.fetchedSuccessfully(QueueItemResponseMessages.foundSuccessfullyMessage, queueItem)
      })
    } catch (error) {
      return this.handleError(error, queueItemConstraintErrorMessages, QueueItemResponseMessages.notFoundErrorMessage)
    }
  }

  async getAll(filters: QueueItemFiltersDto): Promise<ServiceResponse<QueueItemsResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueItemRepository.session(this.context, async (queueItemRepository) => {
        const result = await queueItemRepository.getAll(filters)
        return this.fetchedSuccessfully(QueueItemResponseMessages.listFoundSuccessfullyMessage, result)
      })
    } catch (error) {
      return this.handleError(error, queueItemConstraintErrorMessages, QueueItemResponseMessages.notFoundErrorMessage)
    }
  }

  async update(
    id: number, 
    updates: UpdateQueueItemDto
  ): Promise<ServiceResponse<QueueItemResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueItemRepository.session(this.context, async (queueItemRepository) => {
        const updatedQueueItem = await queueItemRepository.update(id, updates)
        return this.updatedSuccessfully(QueueItemResponseMessages.updatedSuccessfullyMessage, updatedQueueItem)
      })
    } catch (error) {
      return this.handleError(error, queueItemConstraintErrorMessages, QueueItemResponseMessages.notFoundErrorMessage)
    }
  }

  async delete(id: number): Promise<ServiceResponse<null | ServiceResponseObjectError>> {
    try {
      return await QueueItemRepository.session(this.context, async (queueItemRepository) => {
        await queueItemRepository.delete(id)
        return this.deletedSuccessfully(QueueItemResponseMessages.deletedSuccessfullyMessage, null)
      })
    } catch (error) {
      return this.handleError(error, queueItemConstraintErrorMessages, QueueItemResponseMessages.notFoundErrorMessage)
    }
  }

  async retry(id: number): Promise<ServiceResponse<QueueItemResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueItemRepository.session(this.context, async (queueItemRepository) => {
        const retriedQueueItem = await queueItemRepository.retry(id)
        return this.updatedSuccessfully(QueueItemResponseMessages.retriedSuccessfullyMessage, retriedQueueItem)
      })
    } catch (error) {
      return this.handleError(error, queueItemConstraintErrorMessages, QueueItemResponseMessages.notFoundErrorMessage)
    }
  }

  async cancel(id: number): Promise<ServiceResponse<QueueItemResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueItemRepository.session(this.context, async (queueItemRepository) => {
        const cancelledQueueItem = await queueItemRepository.cancel(id)
        return this.updatedSuccessfully(QueueItemResponseMessages.cancelledSuccessfullyMessage, cancelledQueueItem)
      })
    } catch (error) {
      return this.handleError(error, queueItemConstraintErrorMessages, QueueItemResponseMessages.notFoundErrorMessage)
    }
  }

  async export(options: ExportOptionsDto): Promise<ServiceResponse<ExportResultDto | ServiceResponseObjectError | null>> {
    try {
      // TODO: Implement actual export logic
      // This would typically involve:
      // 1. Querying items based on filters/selectedIds
      // 2. Converting to requested format (CSV/JSON)
      // 3. Storing file temporarily
      // 4. Returning download URL with expiration
      
      const mockResult: ExportResultDto = {
        downloadUrl: `/api/exports/queue-items-${Date.now()}.${options.format}`,
        fileName: `queue-items-export.${options.format}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        itemCount: 0, // Would be calculated from actual query
      }
      
      return this.fetchedSuccessfully(QueueItemResponseMessages.exportedSuccessfullyMessage, mockResult)
    } catch (error) {
      return this.handleError(error, queueItemConstraintErrorMessages, QueueItemResponseMessages.exportFailedErrorMessage)
    }
  }
}