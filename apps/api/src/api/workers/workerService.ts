import { WorkerRepository } from '@/api/workers/workerRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { IWorker } from '@/api/workers/worker'
import { WorkerResponseDto, CreateWorkerDto, GetWorkersQueryDto, PaginatedWorkersResponseDto } from '@/api/workers/workerModel'
import { BaseService } from '@/common/services/baseService'
import { workerConstraintErrorMessages, WorkerResponseMessages } from './workerResponseMessages'
import { ServiceResponseObjectError } from '@/common/services/services'

export class WorkerService
  extends BaseService
  implements IWorker<any, Promise<ServiceResponse<WorkerResponseDto | ServiceResponseObjectError | null>>>
{
  constructor() {
    super()
  }

  async getAll(query: GetWorkersQueryDto): Promise<ServiceResponse<PaginatedWorkersResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await WorkerRepository.session(this.context, async (workerRepository) => {
        const paginatedWorkers = await workerRepository.getAll(query)
        return this.fetchedSuccessfully(WorkerResponseMessages.foundSuccessfullyMessage, paginatedWorkers)
      })
    } catch (error) {
      return this.handleError(error, workerConstraintErrorMessages, WorkerResponseMessages.notFoundErrorMessage)
    }
  }

  async getByKey(key: string): Promise<ServiceResponse<WorkerResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await WorkerRepository.session(this.context, async (workerRepository) => {
        const worker = await workerRepository.getByKey(key)
        if (!worker) {
          return this.notFoundError(WorkerResponseMessages.notFoundErrorMessage)
        }
        return this.updatedSuccessfully(WorkerResponseMessages.foundSuccessfullyMessage, worker)
      })
    } catch (error) {
      return this.handleError(error, workerConstraintErrorMessages, WorkerResponseMessages.notFoundErrorMessage)
    }
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
