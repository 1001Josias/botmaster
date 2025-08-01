import { QueueRepository } from './queueRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { 
  QueueResponseDto, 
  CreateQueueDto, 
  UpdateQueueDto, 
  QueueStatusType,
  QueueStatsDto
} from './queueModel'
import { BaseService } from '@/common/services/baseService'
import { queueConstraintErrorMessages, QueueResponseMessages } from './queueResponseMessages'
import { ServiceResponseObjectError } from '@/common/services/services'

export interface IQueueService {
  create(queue: CreateQueueDto): Promise<ServiceResponse<QueueResponseDto | ServiceResponseObjectError | null>>
  getById(id: number): Promise<ServiceResponse<QueueResponseDto | ServiceResponseObjectError | null>>
  getByKey(key: string): Promise<ServiceResponse<QueueResponseDto | ServiceResponseObjectError | null>>
  getAll(options: {
    page: number
    limit: number
    status?: QueueStatusType
    folderKey?: string
    search?: string
  }): Promise<ServiceResponse<{ queues: QueueResponseDto[], total: number } | ServiceResponseObjectError | null>>
  update(id: number, updates: UpdateQueueDto): Promise<ServiceResponse<QueueResponseDto | ServiceResponseObjectError | null>>
  delete(id: number): Promise<ServiceResponse<null | ServiceResponseObjectError>>
  pause(id: number): Promise<ServiceResponse<QueueResponseDto | ServiceResponseObjectError | null>>
  resume(id: number): Promise<ServiceResponse<QueueResponseDto | ServiceResponseObjectError | null>>
  getStats(id: number): Promise<ServiceResponse<QueueStatsDto | ServiceResponseObjectError | null>>
}

export class QueueService extends BaseService implements IQueueService {
  constructor() {
    super()
  }

  async create(
    queue: CreateQueueDto
  ): Promise<ServiceResponse<QueueResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueRepository.session(this.context, async (queueRepository) => {
        const createdQueue = await queueRepository.create(queue)
        return this.createdSuccessfully(QueueResponseMessages.createdSuccessfullyMessage, createdQueue)
      })
    } catch (error) {
      return this.handleError(error, queueConstraintErrorMessages, QueueResponseMessages.notFoundErrorMessage)
    }
  }

  async getById(id: number): Promise<ServiceResponse<QueueResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueRepository.session(this.context, async (queueRepository) => {
        const queue = await queueRepository.getById(id)
        if (!queue) {
          return this.notFoundError(QueueResponseMessages.notFoundErrorMessage)
        }
        return this.fetchedSuccessfully(QueueResponseMessages.foundSuccessfullyMessage, queue)
      })
    } catch (error) {
      return this.handleError(error, queueConstraintErrorMessages, QueueResponseMessages.notFoundErrorMessage)
    }
  }

  async getByKey(key: string): Promise<ServiceResponse<QueueResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueRepository.session(this.context, async (queueRepository) => {
        const queue = await queueRepository.getByKey(key)
        if (!queue) {
          return this.notFoundError(QueueResponseMessages.notFoundErrorMessage)
        }
        return this.fetchedSuccessfully(QueueResponseMessages.foundSuccessfullyMessage, queue)
      })
    } catch (error) {
      return this.handleError(error, queueConstraintErrorMessages, QueueResponseMessages.notFoundErrorMessage)
    }
  }

  async getAll(options: {
    page: number
    limit: number
    status?: QueueStatusType
    folderKey?: string
    search?: string
  }): Promise<ServiceResponse<{ queues: QueueResponseDto[], total: number } | ServiceResponseObjectError | null>> {
    try {
      return await QueueRepository.session(this.context, async (queueRepository) => {
        const result = await queueRepository.getAll(options)
        return this.fetchedSuccessfully(QueueResponseMessages.listFoundSuccessfullyMessage, result)
      })
    } catch (error) {
      return this.handleError(error, queueConstraintErrorMessages, QueueResponseMessages.notFoundErrorMessage)
    }
  }

  async update(
    id: number, 
    updates: UpdateQueueDto
  ): Promise<ServiceResponse<QueueResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueRepository.session(this.context, async (queueRepository) => {
        const updatedQueue = await queueRepository.update(id, updates)
        return this.updatedSuccessfully(QueueResponseMessages.updatedSuccessfullyMessage, updatedQueue)
      })
    } catch (error) {
      return this.handleError(error, queueConstraintErrorMessages, QueueResponseMessages.notFoundErrorMessage)
    }
  }

  async delete(id: number): Promise<ServiceResponse<null | ServiceResponseObjectError>> {
    try {
      return await QueueRepository.session(this.context, async (queueRepository) => {
        await queueRepository.delete(id)
        return this.deletedSuccessfully(QueueResponseMessages.deletedSuccessfullyMessage, null)
      })
    } catch (error) {
      return this.handleError(error, queueConstraintErrorMessages, QueueResponseMessages.notFoundErrorMessage)
    }
  }

  async pause(id: number): Promise<ServiceResponse<QueueResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueRepository.session(this.context, async (queueRepository) => {
        const pausedQueue = await queueRepository.updateStatus(id, 'paused')
        return this.updatedSuccessfully(QueueResponseMessages.pausedSuccessfullyMessage, pausedQueue)
      })
    } catch (error) {
      return this.handleError(error, queueConstraintErrorMessages, QueueResponseMessages.notFoundErrorMessage)
    }
  }

  async resume(id: number): Promise<ServiceResponse<QueueResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueRepository.session(this.context, async (queueRepository) => {
        const resumedQueue = await queueRepository.updateStatus(id, 'active')
        return this.updatedSuccessfully(QueueResponseMessages.resumedSuccessfullyMessage, resumedQueue)
      })
    } catch (error) {
      return this.handleError(error, queueConstraintErrorMessages, QueueResponseMessages.notFoundErrorMessage)
    }
  }

  async getStats(id: number): Promise<ServiceResponse<QueueStatsDto | ServiceResponseObjectError | null>> {
    try {
      return await QueueRepository.session(this.context, async (queueRepository) => {
        const stats = await queueRepository.getStats(id)
        return this.fetchedSuccessfully(QueueResponseMessages.statsFoundSuccessfullyMessage, stats)
      })
    } catch (error) {
      return this.handleError(error, queueConstraintErrorMessages, QueueResponseMessages.notFoundErrorMessage)
    }
  }
}