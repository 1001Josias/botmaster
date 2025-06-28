import { StatusCodes } from 'http-status-codes'

import { WorkerRepository } from '@/api/workers/workerRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { IWorker } from '@/api/workers/worker'
import { WorkerResponseDto, CreateWorkerDto } from '@/api/workers/workerModel'
import { logger } from '@/server'
import { WorkerInvalidScopeRefException } from './workerExceptions'
import { BaseService } from '@/common/services/baseService'
import { WorkerResponseMessages } from './workerResponseMessages'

export class WorkerService
  extends BaseService
  implements IWorker<[CreateWorkerDto], Promise<ServiceResponse<WorkerResponseDto | null>>>
{
  private workerRepository: WorkerRepository

  constructor(repository: WorkerRepository = new WorkerRepository()) {
    super()
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
      return this.createdSuccessfully(WorkerResponseMessages.createdSuccessfullyMessage, createdWorker)
    } catch (err) {
      logger.warn(`${err.name}: ${err.message}`)
      return ServiceResponse.failure<null>(err.message, null, err.status)
      throw err
    }
  }
}
