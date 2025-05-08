import { RequestHandler } from 'express'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { WorkerService } from '@/api/workers/workerService'
import { IWorkerContract } from '@/api/workers/worker'
import { Worker } from '@/api/workers/workerModel'

export class WorkerController implements IWorkerContract<any, any> {
  private workerService: WorkerService

  constructor(service: WorkerService = new WorkerService()) {
    this.workerService = service
  }

  public createWorker: RequestHandler<{}, {}, Worker> = async (req, res, next) => {
    try {
      const workerService = await this.workerService.createWorker(req.body)
      return handleServiceResponse(workerService, res)
    } catch (err) {
      next(err)
    }
  }
}

export const workerController = new WorkerController()
