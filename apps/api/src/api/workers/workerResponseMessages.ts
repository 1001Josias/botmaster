import { ServiceResponseErrorParams } from '@/common/services/services'

export class WorkerResponseMessages {
  static createdSuccessfullyMessage: string = 'Worker created successfully'

  static alreadyExistsErrorMessage: ServiceResponseErrorParams = {
    message: 'Already exists a worker with this name',
    responseObject: null,
  }

  static invalidScopeRefPublic: ServiceResponseErrorParams = {
    message: 'ScopeRef must be null when scope is public',
    responseObject: null,
  }
}

export const workerConstraintErrorMessages = {
  worker_name_key: WorkerResponseMessages.alreadyExistsErrorMessage,
}

export type WorkerConstraints = keyof typeof workerConstraintErrorMessages
