import { WorkerRepository } from '@/api/workers/workerRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { IWorker } from '@/api/workers/worker'
import { WorkerResponseDto, CreateWorkerDto } from '@/api/workers/workerModel'
import { BaseService } from '@/common/services/baseService'
import { workerConstraintErrorMessages, WorkerResponseMessages } from './workerResponseMessages'
import { ServiceResponseObjectError } from '@/common/services/services'

export class WorkerService
  extends BaseService
  implements IWorker<[CreateWorkerDto], Promise<ServiceResponse<WorkerResponseDto | ServiceResponseObjectError | null>>>
{
  constructor() {
    super()
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

      // TODO: if scope is 'folder', scopeRef should be set to the folder key from the context, in which case scopeRef should not be provided
      // TODO: if scope is 'folder', worker should be installed automatically in the folder from the context

      return await WorkerRepository.session(this.context, async (workerRepository) => {
        const createdWorker = await workerRepository.create(worker)
        return this.createdSuccessfully(WorkerResponseMessages.createdSuccessfullyMessage, createdWorker)
      })
    } catch (error) {
      return this.handleError(error, workerConstraintErrorMessages, WorkerResponseMessages.notFoundErrorMessage)
    }
  }
}
