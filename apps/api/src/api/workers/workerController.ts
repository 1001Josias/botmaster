import { NextFunction, Request } from 'express'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { WorkerService } from '@/api/workers/workerService'
import { IWorker } from '@/api/workers/worker'
import { CreateWorkerDto, WorkerResponseDto } from '@/api/workers/workerModel'
import { ResponseCustom } from '@/common/utils/httpHandlers'
import { BaseController } from '@/common/controllers/baseController'
import { WorkerResponseMessages } from './workerResponseMessages'

export class WorkerController
  extends BaseController<WorkerService>
  implements IWorker<[Request<CreateWorkerDto>, ResponseCustom<WorkerResponseDto, CreateWorkerDto>, NextFunction]>
{
  constructor(service: WorkerService = new WorkerService()) {
    super(service)
  }

  public async create(
    req: Request<CreateWorkerDto>,
    res: ResponseCustom<WorkerResponseDto, CreateWorkerDto>,
    next: NextFunction
  ) {
    try {
      return await this.context<WorkerResponseMessages>(req, async (workerService) => {
        const worker = await workerService.create(res.locals.validatedData.body as CreateWorkerDto)
        return handleServiceResponse(worker, res)
      })
    } catch (err) {
      next(err)
    }
  }
}

export const workerController = new WorkerController()
