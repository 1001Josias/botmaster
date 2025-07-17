import { ServiceResponse } from '@/common/models/serviceResponse'
import { ServiceResponseObjectError } from '@/common/services/services'
import { WorkerInstallationDto, WorkerInstallationResponseDto } from './workerInstallationModel'

import { Request, NextFunction } from 'express'
import { ResponseCustom } from '@/common/utils/httpHandlers'

export interface IWorkerInstallationBase {
  install: (...args: any[]) => Promise<any>
  uninstall: (...args: any[]) => Promise<any>
}

export interface IWorkerInstallationRepository extends IWorkerInstallationBase {
  install: (worker: WorkerInstallationDto) => Promise<WorkerInstallationResponseDto>
  uninstall: (workerKey: string) => Promise<WorkerInstallationResponseDto>
}

export interface IWorkerInstallationService extends IWorkerInstallationBase {
  install: (
    worker: WorkerInstallationDto
  ) => Promise<ServiceResponse<WorkerInstallationResponseDto | ServiceResponseObjectError | null>>
  uninstall: (
    workerKey: string
  ) => Promise<ServiceResponse<WorkerInstallationResponseDto | ServiceResponseObjectError | null>>
}

export interface IWorkerInstallationController extends IWorkerInstallationBase {
  install: (
    req: Request<WorkerInstallationDto>,
    res: ResponseCustom<WorkerInstallationResponseDto, WorkerInstallationDto>,
    next: NextFunction
  ) => Promise<void>
  uninstall: (
    req: Request<DeleteWorkerInstallationDto>,
    res: ResponseCustom<null, null>,
    next: NextFunction
  ) => Promise<void>
}
