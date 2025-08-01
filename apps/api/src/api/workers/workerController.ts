import { NextFunction, Request } from 'express'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { WorkerService } from '@/api/workers/workerService'
import { IWorker } from '@/api/workers/worker'
import { CreateWorkerDto, WorkerResponseDto, GetWorkersQueryDto, PaginatedWorkersResponseDto } from '@/api/workers/workerModel'
import { ResponseCustom } from '@/common/utils/httpHandlers'
import { BaseController } from '@/common/controllers/baseController'
import { WorkerResponseMessages } from './workerResponseMessages'

export class WorkerController extends BaseController<WorkerService> {
  constructor(service: WorkerService = new WorkerService()) {
    super(service)
  }

  public getAll = async (
    req: Request,
    res: ResponseCustom<PaginatedWorkersResponseDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context<WorkerResponseMessages>(req, async (workerService) => {
        const query = res.locals.validatedData.query as GetWorkersQueryDto
        const workers = await workerService.getAll(query)
        return handleServiceResponse(workers, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public getByKey = async (
    req: Request<{ key: string }>,
    res: ResponseCustom<WorkerResponseDto, { key: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<WorkerResponseMessages>(req, async (workerService) => {
        const { key } = req.params
        const worker = await workerService.getByKey(key)
        return handleServiceResponse(worker, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public create = async (
    req: Request<CreateWorkerDto>,
    res: ResponseCustom<WorkerResponseDto, CreateWorkerDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context<WorkerResponseMessages>(req, async (workerService) => {
        const worker = res.locals.validatedData.body as CreateWorkerDto
        const createdWorker = await workerService.create(worker)
        return handleServiceResponse(createdWorker, res)
      })
    } catch (err) {
      next(err)
    }
  }
}

export const workerController = new WorkerController()
