import { ServiceResponseErrorParams } from '@/common/services/services'
import { Scope } from './workerModel'

export class WorkerResponseMessages {
  static createdSuccessfullyMessage: string = 'Worker created successfully'
  static foundSuccessfullyMessage: string = 'Worker found successfully'
  static updatedSuccessfullyMessage: string = 'Worker updated successfully'
  static statusUpdatedSuccessfullyMessage: string = 'Worker status updated successfully'
  static deletedSuccessfullyMessage: string = 'Worker deleted successfully'

  static alreadyExistsErrorMessage: ServiceResponseErrorParams = {
    message: 'Already exists a worker with this name',
    responseObject: null,
  }

  static notFoundErrorMessage: ServiceResponseErrorParams = {
    message: 'Worker not found',
    responseObject: null,
  }

  static updateErrorMessage: ServiceResponseErrorParams = {
    message: 'Failed to update worker',
    responseObject: null,
  }

  static statusUpdateErrorMessage: ServiceResponseErrorParams = {
    message: 'Failed to update worker status',
    responseObject: null,
  }

  static deleteErrorMessage: ServiceResponseErrorParams = {
    message: 'Failed to delete worker',
    responseObject: null,
  }

  static invalidScopeRefPublic: ServiceResponseErrorParams = {
    message: 'ScopeRef must be null when scope is public',
    responseObject: null,
  }

  static invalidScopeRefPrivate = (scope: Scope): ServiceResponseErrorParams => ({
    message: `ScopeRef must not be null when scope is ${scope}`,
    responseObject: null,
  })
}

export const workerConstraintErrorMessages = {
  worker_name_key: WorkerResponseMessages.alreadyExistsErrorMessage,
}
