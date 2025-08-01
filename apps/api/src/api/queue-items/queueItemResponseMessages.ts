import { ServiceResponseErrorParams } from '@/common/services/services'

export class QueueItemResponseMessages {
  static createdSuccessfullyMessage: string = 'Queue item created successfully'
  static foundSuccessfullyMessage: string = 'Queue item found successfully'
  static listFoundSuccessfullyMessage: string = 'Queue items found successfully'
  static updatedSuccessfullyMessage: string = 'Queue item updated successfully'
  static deletedSuccessfullyMessage: string = 'Queue item deleted successfully'
  static retriedSuccessfullyMessage: string = 'Queue item retry initiated successfully'
  static cancelledSuccessfullyMessage: string = 'Queue item cancelled successfully'
  static exportedSuccessfullyMessage: string = 'Queue items exported successfully'

  static notFoundErrorMessage: ServiceResponseErrorParams = {
    message: 'Queue item not found',
    responseObject: null,
  }

  static invalidStatusErrorMessage: ServiceResponseErrorParams = {
    message: 'Invalid queue item status provided',
    responseObject: null,
  }

  static queueNotFoundErrorMessage: ServiceResponseErrorParams = {
    message: 'Referenced queue not found',
    responseObject: null,
  }

  static exportFailedErrorMessage: ServiceResponseErrorParams = {
    message: 'Failed to export queue items',
    responseObject: null,
  }
}

export const queueItemConstraintErrorMessages = {
  queue_items_queue_id_fkey: QueueItemResponseMessages.queueNotFoundErrorMessage,
  queue_items_job_id_key: {
    message: 'Queue item with this job ID already exists',
    responseObject: null,
  },
}