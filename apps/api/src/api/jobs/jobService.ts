import { StatusCodes } from 'http-status-codes'
import type { ServiceResponse } from '@/common/models/serviceResponse'
import { ServiceResponse as ServiceResponseClass } from '@/common/models/serviceResponse'
import { logger } from '@/server'
import { CreateJobDto, JobResponseDto, JobStatsResponseDto, JobStatus, UpdateJobDto } from './jobModel'
import { JobRepository } from './jobRepository'
import { BaseService } from '@/common/services/baseService'
import { JobResponseMessages } from './jobResponseMessages'

export class JobService extends BaseService {
  private responseMessages: JobResponseMessages

  constructor() {
    super()
    this.responseMessages = new JobResponseMessages()
  }

  async findAll(
    page = 1,
    limit = 20,
    filters: {
      status?: JobStatus
      workerKey?: string
      flowKey?: string
    } = {}
  ): Promise<ServiceResponse<any>> {
    try {
      const result = await JobRepository.session(this.context, async (repository) => {
        return await repository.findAll(page, limit, filters)
      })
      
      return this.fetchedSuccessfully(this.responseMessages.jobsRetrieved, {
        ...result,
        page,
        limit,
      })
    } catch (ex) {
      const errorMessage = `Error finding jobs: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponseClass.failure(
        'An error occurred while retrieving jobs.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async findByKey(key: string): Promise<ServiceResponse<any>> {
    try {
      const job = await JobRepository.session(this.context, async (repository) => {
        return await repository.findByKey(key)
      })
      
      if (!job) {
        return ServiceResponseClass.failure(this.responseMessages.jobNotFound, null, StatusCodes.NOT_FOUND)
      }
      
      return this.fetchedSuccessfully('Job found', job)
    } catch (ex) {
      const errorMessage = `Error finding job: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponseClass.failure(
        'An error occurred while finding the job.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async create(jobData: CreateJobDto, userId: number): Promise<ServiceResponse<any>> {
    try {
      const job = await JobRepository.session(this.context, async (repository) => {
        return await repository.create(jobData, userId)
      })
      
      return this.createdSuccessfully(this.responseMessages.jobCreated, job)
    } catch (ex) {
      const errorMessage = `Error creating job: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponseClass.failure(
        'An error occurred while creating the job.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async update(key: string, updates: UpdateJobDto, userId: number): Promise<ServiceResponse<any>> {
    try {
      // Special handling for status changes
      if (updates.status) {
        updates = await this.handleStatusChange(updates, key)
      }

      const job = await JobRepository.session(this.context, async (repository) => {
        return await repository.update(key, updates, userId)
      })
      
      if (!job) {
        return ServiceResponseClass.failure(this.responseMessages.jobNotFound, null, StatusCodes.NOT_FOUND)
      }

      return this.updatedSuccessfully(this.responseMessages.jobUpdated, job)
    } catch (ex) {
      const errorMessage = `Error updating job: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponseClass.failure(
        'An error occurred while updating the job.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async delete(key: string): Promise<ServiceResponse<any>> {
    try {
      const deleted = await JobRepository.session(this.context, async (repository) => {
        return await repository.delete(key)
      })
      
      if (!deleted) {
        return ServiceResponseClass.failure(this.responseMessages.jobNotFound, null, StatusCodes.NOT_FOUND)
      }

      return this.deletedSuccessfully(this.responseMessages.jobDeleted, null)
    } catch (ex) {
      const errorMessage = `Error deleting job: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponseClass.failure(
        'An error occurred while deleting the job.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async getStats(): Promise<ServiceResponse<any>> {
    try {
      const stats = await JobRepository.session(this.context, async (repository) => {
        return await repository.getStats()
      })
      
      return this.fetchedSuccessfully(this.responseMessages.jobStatsRetrieved, stats)
    } catch (ex) {
      const errorMessage = `Error getting job statistics: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponseClass.failure(
        'An error occurred while retrieving job statistics.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async startJob(key: string, userId: number): Promise<ServiceResponse<any>> {
    try {
      const updates: UpdateJobDto = {
        status: 'running',
        startedAt: new Date(),
        progress: 0,
      }

      const job = await JobRepository.session(this.context, async (repository) => {
        return await repository.update(key, updates, userId)
      })
      
      if (!job) {
        return ServiceResponseClass.failure(this.responseMessages.jobNotFound, null, StatusCodes.NOT_FOUND)
      }

      return this.updatedSuccessfully(this.responseMessages.jobStarted, job)
    } catch (ex) {
      const errorMessage = `Error starting job: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponseClass.failure(
        'An error occurred while starting the job.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async completeJob(
    key: string, 
    result: Record<string, any>,
    userId: number
  ): Promise<ServiceResponse<any>> {
    try {
      // Get current job to calculate duration
      const currentJob = await JobRepository.session(this.context, async (repository) => {
        return await repository.findByKey(key)
      })
      
      if (!currentJob) {
        return ServiceResponseClass.failure(this.responseMessages.jobNotFound, null, StatusCodes.NOT_FOUND)
      }

      const completedAt = new Date()
      let duration: number | null = null
      
      if (currentJob.startedAt) {
        duration = completedAt.getTime() - new Date(currentJob.startedAt).getTime()
      }

      const updates: UpdateJobDto = {
        status: 'completed',
        result,
        progress: 100,
        completedAt,
        duration,
      }

      const job = await JobRepository.session(this.context, async (repository) => {
        return await repository.update(key, updates, userId)
      })
      
      return this.updatedSuccessfully(this.responseMessages.jobCompleted, job)
    } catch (ex) {
      const errorMessage = `Error completing job: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponseClass.failure(
        'An error occurred while completing the job.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async failJob(
    key: string, 
    error: string,
    userId: number
  ): Promise<ServiceResponse<any>> {
    try {
      // Get current job to calculate duration
      const currentJob = await JobRepository.session(this.context, async (repository) => {
        return await repository.findByKey(key)
      })
      
      if (!currentJob) {
        return ServiceResponseClass.failure(this.responseMessages.jobNotFound, null, StatusCodes.NOT_FOUND)
      }

      const completedAt = new Date()
      let duration: number | null = null
      
      if (currentJob.startedAt) {
        duration = completedAt.getTime() - new Date(currentJob.startedAt).getTime()
      }

      const updates: UpdateJobDto = {
        status: 'failed',
        error,
        completedAt,
        duration,
      }

      const job = await JobRepository.session(this.context, async (repository) => {
        return await repository.update(key, updates, userId)
      })
      
      return this.updatedSuccessfully(this.responseMessages.jobFailed, job)
    } catch (ex) {
      const errorMessage = `Error failing job: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponseClass.failure(
        'An error occurred while marking the job as failed.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  private async handleStatusChange(updates: UpdateJobDto, key: string): Promise<UpdateJobDto> {
    const currentJob = await JobRepository.session(this.context, async (repository) => {
      return await repository.findByKey(key)
    })
    
    if (!currentJob) {
      return updates
    }

    const now = new Date()

    switch (updates.status) {
      case 'running':
        if (currentJob.status === 'pending') {
          updates.startedAt = now
          updates.progress = 0
        }
        break
      
      case 'completed':
        if (currentJob.startedAt && !updates.completedAt) {
          updates.completedAt = now
          updates.progress = 100
          if (!updates.duration) {
            updates.duration = now.getTime() - new Date(currentJob.startedAt).getTime()
          }
        }
        break
      
      case 'failed':
        if (currentJob.startedAt && !updates.completedAt) {
          updates.completedAt = now
          if (!updates.duration) {
            updates.duration = now.getTime() - new Date(currentJob.startedAt).getTime()
          }
        }
        break
    }

    return updates
  }
}