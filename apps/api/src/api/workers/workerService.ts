import { StatusCodes } from 'http-status-codes'

import { WorkerRepository } from '@/api/workers/workerRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { IWorker } from '@/api/workers/worker'
import { WorkerResponseDto, CreateWorkerDto } from '@/api/workers/workerModel'
import { BusinessError } from '@/common/utils/errorHandlers'
import { logger } from '@/server'
import { WorkerInvalidScopeRefException } from './workerExceptions'

export class WorkerService implements IWorker<[CreateWorkerDto], Promise<ServiceResponse<WorkerResponseDto | null>>> {
  private workerRepository: WorkerRepository

  constructor(repository: WorkerRepository = new WorkerRepository()) {
    this.workerRepository = repository
  }

  async create(worker: CreateWorkerDto): Promise<ServiceResponse<WorkerResponseDto | null>> {
    try {
      if (worker.scope === 'public' && worker.scopeRef !== null) {
        throw new WorkerInvalidScopeRefException(worker)
      }

      if (worker.scope !== 'public' && worker.scopeRef === null) {
        throw new WorkerInvalidScopeRefException(worker)
      }

      const createdWorker = await this.workerRepository.create(worker)
      const message = `Worker created successfully`
      return ServiceResponse.success(message, createdWorker, StatusCodes.CREATED)
    } catch (err) {
      if (err instanceof BusinessError) {
        logger.warn(`${err.name}: ${err.message}`)
        return ServiceResponse.failure<null>(err.message, null, err.status)
      }
      throw err
    }
  }
}
