import { ServiceResponseErrorParams } from '@/common/services/services'

export class WorkerResponseMessages {
  static createdSuccessfullyMessage: string = 'Worker created successfully'

  static workerAlreadyExistsErrorMessage: ServiceResponseErrorParams = {
    message: 'Already exists a worker with this name',
    responseObject: null,
  }
}

export const workerConstraintErrorMessages = {
  worker_name_key: WorkerResponseMessages.workerAlreadyExistsErrorMessage,
}

export type WorkerConstraints = keyof typeof workerConstraintErrorMessages
