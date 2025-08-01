import { ServiceResponseErrorParams } from '@/common/services/services'

export class QueueResponseMessages {
  static createdSuccessfullyMessage: string = 'Queue created successfully'
  static foundSuccessfullyMessage: string = 'Queue found successfully'
  static listFoundSuccessfullyMessage: string = 'Queues found successfully'
  static updatedSuccessfullyMessage: string = 'Queue updated successfully'
  static deletedSuccessfullyMessage: string = 'Queue deleted successfully'
  static pausedSuccessfullyMessage: string = 'Queue paused successfully'  
  static resumedSuccessfullyMessage: string = 'Queue resumed successfully'
  static statsFoundSuccessfullyMessage: string = 'Queue statistics found successfully'

  static alreadyExistsErrorMessage: ServiceResponseErrorParams = {
    message: 'Already exists a queue with this name',
    responseObject: null,
  }

  static notFoundErrorMessage: ServiceResponseErrorParams = {
    message: 'Queue not found',
    responseObject: null,
  }

  static invalidStatusErrorMessage: ServiceResponseErrorParams = {
    message: 'Invalid queue status provided',
    responseObject: null,
  }
}

export const queueConstraintErrorMessages = {
  queues_name_key: QueueResponseMessages.alreadyExistsErrorMessage,
  queues_key_key: QueueResponseMessages.alreadyExistsErrorMessage,
}