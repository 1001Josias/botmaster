import {
  WorkerInstallationDto,
  WorkerInstallationResponseDto,
} from '@/api/workers/installations/workerInstallationModel'
import { WorkerInstallationRepository } from '@/api/workers/installations/workerInstallationRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { IWorkerInstallationService } from './workerInstallation'
import { BaseService } from '@/common/services/baseService'
import {
  WorkerInstallationResponseMessages,
  workerInstallationConstraintErrorMessages,
} from './workerInstallationMessages'
import { ServiceResponseObjectError } from '@/common/services/services'
import { logger } from '@/server'

export class WorkerInstallationService extends BaseService implements IWorkerInstallationService {
  constructor() {
    super()
  }

  async install(
    workerInstallation: WorkerInstallationDto
  ): Promise<ServiceResponse<WorkerInstallationResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await WorkerInstallationRepository.session(this.context, async (workerInstallationRepository) => {
        logger.info({ workerInstallation }, 'Installing worker:')
        const workerInstallationResponse = await workerInstallationRepository.install(workerInstallation)
        return this.createdSuccessfully(
          WorkerInstallationResponseMessages.installedSuccessfullyMessage,
          workerInstallationResponse
        )
      })
    } catch (error) {
      return this.handleError(
        error,
        workerInstallationConstraintErrorMessages,
        WorkerInstallationResponseMessages.notFoundErrorMessage
      )
    }
  }

  async uninstall(
    workerKey: string
  ): Promise<ServiceResponse<WorkerInstallationResponseDto | ServiceResponseObjectError | null>> {
    try {
      return await WorkerInstallationRepository.session(this.context, async (workerInstallationRepository) => {
        logger.info(`Uninstalling worker ${workerKey}...`)
        const workerUninstalled = await workerInstallationRepository.uninstall(workerKey)
        return this.deletedSuccessfully(
          WorkerInstallationResponseMessages.uninstalledSuccessfullyMessage,
          workerUninstalled
        )
      })
    } catch (error) {
      return this.handleError(
        error,
        workerInstallationConstraintErrorMessages,
        WorkerInstallationResponseMessages.notInstalledErrorMessage
      )
    }
  }

  async getAll(): Promise<ServiceResponse<WorkerInstallationResponseDto[] | ServiceResponseObjectError | null>> {
    try {
      return await WorkerInstallationRepository.session(this.context, async (workerInstallationRepository) => {
        logger.info(`Fetching all installed workers in the folder ${this.context.folderKey}...`)
        const installations = await workerInstallationRepository.getAll()
        return this.fetchedSuccessfully(
          WorkerInstallationResponseMessages.installedWorkersFetchedSuccessfullyMessage,
          installations
        )
      })
    } catch (error) {
      return this.handleError(
        error,
        workerInstallationConstraintErrorMessages,
        WorkerInstallationResponseMessages.notFoundErrorMessage
      )
    }
  }
}
