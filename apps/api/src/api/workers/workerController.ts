import { Response, NextFunction } from 'express'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { WorkerService } from '@/api/workers/workerService'
import { IWorker } from '@/api/workers/worker'
import { WorkerResponseDto } from '@/api/workers/workerModel'
import { RequestWithValidatedData } from '@/common/utils/httpHandlers'

export class WorkerController
  implements IWorker<[RequestWithValidatedData<WorkerResponseDto>, Response, NextFunction]>
{
  private workerService: WorkerService

  constructor(service: WorkerService = new WorkerService()) {
    this.workerService = service
  }

  public createWorker = async (req: RequestWithValidatedData<WorkerResponseDto>, res: Response, next: NextFunction) => {
    try {
      const workerService = await this.workerService.createWorker(req.validatedData)
      return handleServiceResponse(workerService, res)
    } catch (err) {
      next(err)
    }
  }
}

export const workerController = new WorkerController()
