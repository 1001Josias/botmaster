import {
  WorkerInstallationDto,
  WorkerInstallationResponseDto,
} from '@/api/workers/installations/workerInstallationModel'
import { WorkerInstallationRepository } from '@/api/workers/installations/workerInstallationRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { IWorkerInstallation } from './workerInstallation'
import { BaseService } from '@/common/services/baseService'
import {
  WorkerInstallationConstraints,
  WorkerInstallationMessages,
  workerInstallationConstraintErrorMessages,
} from './workerInstallationMessages'
import { ServiceResponseObjectError } from '@/common/services/services'

export class WorkerInstallationService
  extends BaseService
  implements
    IWorkerInstallation<
      [WorkerInstallationDto],
      Promise<ServiceResponse<WorkerInstallationResponseDto | ServiceResponseObjectError | null>>
    >
{
  private workerInstallationRepository: WorkerInstallationRepository

  constructor(repository: WorkerInstallationRepository = new WorkerInstallationRepository()) {
    super()
    this.workerInstallationRepository = repository
  }

  async install(
    workerInstallation: WorkerInstallationDto
  ): Promise<ServiceResponse<WorkerInstallationResponseDto | ServiceResponseObjectError | null>> {
    try {
      const workerInstallationResponse = await this.workerInstallationRepository.install(workerInstallation)
      return this.createdSuccessfully(
        WorkerInstallationMessages.installedSuccessfullyMessage,
        workerInstallationResponse
      )
    } catch (error) {
      return this.handleError(error, (dbError) => {
        return workerInstallationConstraintErrorMessages[dbError.constraint as WorkerInstallationConstraints]
      })
    }
  }
}
