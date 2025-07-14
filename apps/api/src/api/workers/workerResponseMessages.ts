import { ServiceResponseErrorParams } from '@/common/services/services'
import { Scope } from './workerModel'

export class WorkerResponseMessages {
  static createdSuccessfullyMessage: string = 'Worker created successfully'

  static alreadyExistsErrorMessage: ServiceResponseErrorParams = {
    message: 'Already exists a worker with this name',
    responseObject: null,
  }

  static notFoundErrorMessage: ServiceResponseErrorParams = {
    message: 'Worker not found',
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
