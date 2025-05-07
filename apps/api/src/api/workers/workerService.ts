import { StatusCodes } from 'http-status-codes'

import { WorkerRepository } from '@/api/workers/workerRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { IWorker, IWorkerContract } from '@/api/workers/worker'
import { BusinessError } from '@/common/utils/errorHandlers'
import { logger } from '@/server'

export class WorkerService implements IWorkerContract<any, Promise<ServiceResponse<IWorker | null>>> {
  private workerRepository: WorkerRepository

  constructor(repository: WorkerRepository = new WorkerRepository()) {
    this.workerRepository = repository
  }

  async createWorker(worker: IWorker): Promise<ServiceResponse<IWorker | null>> {
    try {
      const createdWorker = await this.workerRepository.createWorker(worker)
      const message = `Worker created successfully`
      return ServiceResponse.success(message, createdWorker, StatusCodes.CREATED)
    } catch (err) {
      if (err instanceof BusinessError) {
        logger.warn(`${err.name}: ${err.message}`)
        return ServiceResponse.failure(err.message, null, err.status)
      }
      throw err
    }
  }
}
