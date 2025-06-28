import { WorkerRepository } from '@/api/workers/workerRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { IWorker } from '@/api/workers/worker'
import { WorkerResponseDto, CreateWorkerDto } from '@/api/workers/workerModel'
import { BaseService } from '@/common/services/baseService'
import { workerConstraintErrorMessages, WorkerConstraints, WorkerResponseMessages } from './workerResponseMessages'
import { ServiceResponseObjectError } from '@/common/services/services'

export class WorkerService
  extends BaseService
  implements IWorker<[CreateWorkerDto], Promise<ServiceResponse<WorkerResponseDto | ServiceResponseObjectError | null>>>
{
  private workerRepository: WorkerRepository

  constructor(repository: WorkerRepository = new WorkerRepository()) {
    super()
    this.workerRepository = repository
  }

  async create(
    worker: CreateWorkerDto
  ): Promise<ServiceResponse<WorkerResponseDto | ServiceResponseObjectError | null>> {
    try {
      if (worker.scope === 'public' && worker.scopeRef !== null) {
        return this.badRequestError(WorkerResponseMessages.invalidScopeRefPublic)
      }

      if (worker.scope !== 'public' && worker.scopeRef === null) {
        return this.badRequestError(WorkerResponseMessages.invalidScopeRefPrivate(worker.scope))
      }

      const createdWorker = await this.workerRepository.create(worker)
      return this.createdSuccessfully(WorkerResponseMessages.createdSuccessfullyMessage, createdWorker)
    } catch (error) {
      return this.handleError(error, (dbError) => {
        return workerConstraintErrorMessages[dbError.constraint as WorkerConstraints]
      })
    }
  }
}
