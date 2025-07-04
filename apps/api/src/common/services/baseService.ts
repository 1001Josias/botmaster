import { DatabaseError } from 'pg'
import { ServiceResponse } from '../models/serviceResponse'
import { PostgresErrorCodes } from '../utils/dbStatusCode'
import { StatusCodes } from 'http-status-codes'
import { logger } from '@/server'
import { ServiceResponseObjectError, ServiceResponseErrorParams } from './services'

export abstract class BaseService {
  protected handleError(
    error: unknown,
    callback: (dbError: DatabaseError) => ServiceResponseErrorParams | undefined
  ): ServiceResponse<ServiceResponseObjectError | null> {
    if (!(error instanceof DatabaseError)) throw error

    const serviceMessage = callback(error)
    if (!serviceMessage) throw error
    logger.warn(`${serviceMessage.message}: ${error.detail}`)

    switch (error.code) {
      case PostgresErrorCodes.UNIQUE_VIOLATION:
        return this.conflictError(serviceMessage)
      case PostgresErrorCodes.FOREIGN_KEY_VIOLATION:
        return this.badRequestError(serviceMessage)
      default:
        logger.debug(`Error code: ${error.code}, message: ${error.message} in entity: ${error.table || 'unknown'}`)
        throw new Error(`Not handled database error: ${error.message}, ${error}`)
    }
  }

  protected conflictError(errorParams: ServiceResponseErrorParams) {
    return ServiceResponse.failure(errorParams.message, errorParams.responseObject, StatusCodes.CONFLICT)
  }

  protected badRequestError(errorParams: ServiceResponseErrorParams) {
    return ServiceResponse.failure(errorParams.message, errorParams.responseObject, StatusCodes.BAD_REQUEST)
  }

  protected notFoundError(errorParams: ServiceResponseErrorParams) {
    return ServiceResponse.failure(errorParams.message, errorParams.responseObject, StatusCodes.NOT_FOUND)
  }

  protected createdSuccessfully<T = null>(message: string, responseObject: T) {
    return ServiceResponse.success(message, responseObject, StatusCodes.CREATED)
  }

  protected updatedSuccessfully<T = null>(message: string, responseObject: T) {
    return ServiceResponse.success(message, responseObject, StatusCodes.OK)
  }

  protected deletedSuccessfully<T = null>(message: string, responseObject: T) {
    return ServiceResponse.success(message, responseObject, StatusCodes.NO_CONTENT)
  }
}
