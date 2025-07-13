import { ServiceResponseErrorParams } from '@/common/services/services'

export class WorkerInstallationMessages {
  static installedSuccessfullyMessage: string = 'Worker installed successfully'

  static alreadyInstalledErrorMessage: ServiceResponseErrorParams = {
    message: 'This worker is already installed',
    responseObject: null,
  }

  static notFoundErrorMessage: ServiceResponseErrorParams = {
    message: 'Worker not found',
    responseObject: null,
  }

  static notAvailableToInstallErrorMessage: ServiceResponseErrorParams = {
    message: 'Worker is not available to install in this folder',
    responseObject: {
      details: 'Verify that the worker scope is correct and that the worker ref allows installation in that folder',
    },
  }
}

export const workerInstallationConstraintErrorMessages = {
  idx_worker_installation_unique: WorkerInstallationMessages.alreadyInstalledErrorMessage,
  worker_installation_worker_key_fkey: WorkerInstallationMessages.notFoundErrorMessage,
}

export type WorkerInstallationConstraints = keyof typeof workerInstallationConstraintErrorMessages
