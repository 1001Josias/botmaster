import { Request, NextFunction } from 'express'
import { WorkerInstallationService } from '@/api/workers/installations/workerInstallationService'
import {
  WorkerInstallationDto,
  WorkerInstallationResponseDto,
  DeleteWorkerInstallationDto,
} from './workerInstallationModel'
import { IWorkerInstallation } from './workerInstallation'
import { handleServiceResponse, ResponseCustom } from '@/common/utils/httpHandlers'
import { logger } from '@/server'
import { BaseController } from '@/common/controllers/baseController'
import { WorkerInstallationResponseMessages } from './workerInstallationMessages'

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
      this.context<WorkerInstallationResponseMessages>(req, async (workerInstallationService) => {
        const body = res.locals.validatedData.body as WorkerInstallationDto
        const workerInstallationServiceResponse = await workerInstallationService.install(body)
        return handleServiceResponse(workerInstallationServiceResponse, res)
      })
    } catch (error) {
      next(error)
    }
  }

  public uninstall = async (
    req: Request<DeleteWorkerInstallationDto>,
    res: ResponseCustom<null, null>,
    next: NextFunction
  ) => {
    try {
      await this.context<void>(req, async (workerInstallationService) => {
        const workerKey = req.params.workerKey
        const serviceResponse = await workerInstallationService.uninstall(workerKey)
        handleServiceResponse(serviceResponse, res)
      })
    } catch (error) {
      next(error)
    }
  }
}

export const workerInstallationController = new WorkerInstallationController()
