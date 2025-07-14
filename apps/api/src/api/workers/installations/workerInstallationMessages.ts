import { ServiceResponseErrorParams } from '@/common/services/services'

export class WorkerInstallationResponseMessages {
  static installedSuccessfullyMessage: string = 'Worker installed successfully'

  static uninstalledSuccessfullyMessage(workerKey: string): string {
    return `Worker ${workerKey} uninstalled successfully`
  }

  static alreadyInstalledErrorMessage: ServiceResponseErrorParams = {
    message: 'This worker is already installed',
    responseObject: null,
  }
  static notInstalledErrorMessage: ServiceResponseErrorParams = {
    message: 'This worker is not installed in this folder.',
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
  idx_worker_installation_unique: WorkerInstallationResponseMessages.alreadyInstalledErrorMessage,
  worker_installation_worker_key_fkey: WorkerInstallationResponseMessages.notFoundErrorMessage,
  worker_installation_worker_ref_fkey: WorkerInstallationResponseMessages.notAvailableToInstallErrorMessage,
}
