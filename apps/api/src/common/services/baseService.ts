import { DatabaseError } from 'pg'
import { ServiceResponse } from '../models/serviceResponse'
import { PostgresErrorCodes } from '../utils/dbStatusCode'
import { StatusCodes } from 'http-status-codes'
import { logger } from '@/server'
import { ServiceResponseObjectError, ServiceResponseErrorParams } from './services'
import { ContextDto } from '../utils/commonValidation'
import { ResourceNotFoundError } from '../utils/errorHandlers'

export abstract class BaseService {
  protected context!: ContextDto

  constructor() {}

  protected handleError<T extends { [key: string]: ServiceResponseErrorParams }>(
    error: unknown,
    constraintErrors: T,
    notFoundError: ServiceResponseErrorParams
  ): ServiceResponse<ServiceResponseObjectError | null> {
    try {
      if (!(error instanceof DatabaseError)) throw error
      const constraintErrorMessage = constraintErrors[error.constraint as string]
      switch (error.code) {
        case PostgresErrorCodes.UNIQUE_VIOLATION:
          return this.conflictError(constraintErrorMessage)
        case PostgresErrorCodes.FOREIGN_KEY_VIOLATION:
          return this.badRequestError(constraintErrorMessage)
        default:
          logger.debug(`Error code: ${error.code}, message: ${error.message} in entity: ${error.table || 'unknown'}`)
          throw new Error(`Not handled database error: ${error.message}, ${error}`)
      }
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return this.notFoundError(notFoundError)
      }
      throw error
    }
  }

  protected conflictError(errorParams: ServiceResponseErrorParams) {
    logger.warn(errorParams.responseObject, errorParams.message)
    return ServiceResponse.failure(errorParams.message, errorParams.responseObject, StatusCodes.CONFLICT)
  }

  protected badRequestError(errorParams: ServiceResponseErrorParams) {
    logger.warn(errorParams.responseObject, errorParams.message)
    return ServiceResponse.failure(errorParams.message, errorParams.responseObject, StatusCodes.BAD_REQUEST)
  }

  protected notFoundError(errorParams: ServiceResponseErrorParams) {
    logger.warn(errorParams.responseObject, errorParams.message)
    return ServiceResponse.failure(errorParams.message, errorParams.responseObject, StatusCodes.NOT_FOUND)
  }

  protected createdSuccessfully<T = null>(message: string, responseObject: T) {
    logger.info(responseObject, message)
    return ServiceResponse.success(message, responseObject, StatusCodes.CREATED)
  }

  protected updatedSuccessfully<T = null>(message: string, responseObject: T) {
    logger.info(responseObject, message)
    return ServiceResponse.success(message, responseObject, StatusCodes.OK)
  }

  protected deletedSuccessfully<T = null>(message: string, responseObject: T) {
    logger.info(responseObject, message)
    return ServiceResponse.success(message, responseObject, StatusCodes.OK)
  }

  public setContext(context: ContextDto): void {
    this.context = context
  }
}
