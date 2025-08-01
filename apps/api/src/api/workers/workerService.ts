import { WorkerRepository, PaginatedWorkerResponse } from '@/api/workers/workerRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { IWorker } from '@/api/workers/worker'
import { WorkerResponseDto, CreateWorkerDto, UpdateWorkerDto, UpdateWorkerStatusDto, GetWorkersRouteQuerySchema } from '@/api/workers/workerModel'
import { BaseService } from '@/common/services/baseService'
import { workerConstraintErrorMessages, WorkerResponseMessages } from './workerResponseMessages'
import { ServiceResponseObjectError } from '@/common/services/services'
import { z } from 'zod'

type GetWorkersQuery = z.infer<typeof GetWorkersRouteQuerySchema>

export class WorkerService
  extends BaseService
  implements IWorker<any, Promise<ServiceResponse<WorkerResponseDto | ServiceResponseObjectError | null>>>
{
  constructor() {
    super()
  }

  async getAll(queryParams: GetWorkersQuery): Promise<ServiceResponse<PaginatedWorkerResponse | ServiceResponseObjectError | null>> {
    try {
      return await WorkerRepository.session(this.context, async (workerRepository) => {
        const result = await workerRepository.getAll(queryParams)
        return this.updatedSuccessfully(WorkerResponseMessages.foundSuccessfullyMessage, result)
      })
    } catch (error) {
      return this.handleError(error, workerConstraintErrorMessages, WorkerResponseMessages.notFoundErrorMessage)
    }
  }

  async getById(id: number): Promise<ServiceResponse<WorkerResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await WorkerRepository.session(this.context, async (workerRepository) => {
        const worker = await workerRepository.getById(id)
        if (!worker) {
          return this.notFoundError(WorkerResponseMessages.notFoundErrorMessage)
        }
        return this.updatedSuccessfully(WorkerResponseMessages.foundSuccessfullyMessage, worker)
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

  async update(
    id: number,
    worker: UpdateWorkerDto
  ): Promise<ServiceResponse<WorkerResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await WorkerRepository.session(this.context, async (workerRepository) => {
        const updatedWorker = await workerRepository.update(id, worker)
        if (!updatedWorker) {
          return this.notFoundError(WorkerResponseMessages.notFoundErrorMessage)
        }
        return this.updatedSuccessfully(WorkerResponseMessages.updatedSuccessfullyMessage, updatedWorker)
      })
    } catch (error) {
      return this.handleError(error, workerConstraintErrorMessages, WorkerResponseMessages.updateErrorMessage)
    }
  }

  async updateStatus(
    id: number,
    statusData: UpdateWorkerStatusDto
  ): Promise<ServiceResponse<WorkerResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await WorkerRepository.session(this.context, async (workerRepository) => {
        const updatedWorker = await workerRepository.updateStatus(id, statusData)
        if (!updatedWorker) {
          return this.notFoundError(WorkerResponseMessages.notFoundErrorMessage)
        }
        return this.updatedSuccessfully(WorkerResponseMessages.statusUpdatedSuccessfullyMessage, updatedWorker)
      })
    } catch (error) {
      return this.handleError(error, workerConstraintErrorMessages, WorkerResponseMessages.statusUpdateErrorMessage)
    }
  }

  async delete(id: number): Promise<ServiceResponse<WorkerResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await WorkerRepository.session(this.context, async (workerRepository) => {
        const deletedWorker = await workerRepository.delete(id)
        if (!deletedWorker) {
          return this.notFoundError(WorkerResponseMessages.notFoundErrorMessage)
        }
        return this.updatedSuccessfully(WorkerResponseMessages.deletedSuccessfullyMessage, deletedWorker)
      })
    } catch (error) {
      return this.handleError(error, workerConstraintErrorMessages, WorkerResponseMessages.deleteErrorMessage)
    }
  }
}
