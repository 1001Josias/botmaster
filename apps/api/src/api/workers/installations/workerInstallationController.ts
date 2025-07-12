import { Request, NextFunction } from 'express'
import { WorkerInstallationService } from '@/api/workers/installations/workerInstallationService'
import { WorkerInstallationDto, WorkerInstallationResponseDto } from './workerInstallationModel'
import { IWorkerInstallation } from './workerInstallation'
import { handleServiceResponse, ResponseCustom } from '@/common/utils/httpHandlers'
import { logger } from '@/server'
import { BaseController } from '@/common/controllers/baseController'
import { WorkerInstallationMessages } from './workerInstallationMessages'

export class WorkerInstallationController
  extends BaseController<WorkerInstallationService>
  implements
    IWorkerInstallation<
      [
        Request<WorkerInstallationDto>,
        ResponseCustom<WorkerInstallationResponseDto, WorkerInstallationDto>,
        NextFunction,
      ]
    >
{
  constructor(protected service: WorkerInstallationService = new WorkerInstallationService()) {
    super(service)
  }

  public install = async (
    req: Request<WorkerInstallationDto>,
    res: ResponseCustom<WorkerInstallationResponseDto, WorkerInstallationDto>,
    next: NextFunction
  ) => {
    try {
      this.context<WorkerInstallationMessages>(req, async (workerInstallationService) => {
        const body = res.locals.validatedData.body as WorkerInstallationDto
        const workerInstallationServiceResponse = await workerInstallationService.install(body)
        return handleServiceResponse(workerInstallationServiceResponse, res)
      })
    } catch (error) {
      next(error)
    }
  }
}

export const workerInstallationController = new WorkerInstallationController()
