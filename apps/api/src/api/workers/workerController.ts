import { NextFunction, Request } from 'express'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { WorkerService } from '@/api/workers/workerService'
import { IWorker } from '@/api/workers/worker'
import { CreateWorkerDto, WorkerResponseDto } from '@/api/workers/workerModel'
import { ResponseCustom } from '@/common/utils/httpHandlers'

export class WorkerController
  implements IWorker<[Request<CreateWorkerDto>, ResponseCustom<WorkerResponseDto, CreateWorkerDto>, NextFunction]>
{
  private workerService: WorkerService

  constructor(service: WorkerService = new WorkerService()) {
    this.workerService = service
  }

  public create = async (
    req: Request<CreateWorkerDto>,
    res: ResponseCustom<WorkerResponseDto, CreateWorkerDto>,
    next: NextFunction
  ) => {
    try {
      const workerService = await this.workerService.create(res.locals.validatedData.body as CreateWorkerDto)
      return handleServiceResponse(workerService, res)
    } catch (err) {
      next(err)
    }
  }
}

export const workerController = new WorkerController()
