import { DatabaseError } from 'pg'
import { StatusCodes } from 'http-status-codes'

import { PostgresErrorCodes } from '@/common/utils/dbStatusCode'
import { convertSnakeToPascalCase, firstLetterToUpperCase } from '@/common/utils/stringHandler'

export class BusinessError extends Error {
  constructor(
    public entity: string,
    public message: string,
    public status: number = StatusCodes.BAD_REQUEST,
  ) {
    super(message)
    const entityName = entity.includes('_') ? convertSnakeToPascalCase(entity) : firstLetterToUpperCase(entity)
    this.name = `${entityName}BusinessError`
    this.message = message
    this.status = status
  }
}

export class PostgresError {
  public static toBusinessError(error: DatabaseError): BusinessError | DatabaseError {
    const table = error.table || ''
    switch (error.code) {
      case PostgresErrorCodes.UNIQUE_VIOLATION:
        return this.handleUniqueViolation(error, table)
      default:
        return error
    }
  }

  private static handleUniqueViolation(error: DatabaseError, table: string): BusinessError {
    const detail = error.detail as string
    const message = detail.replace('Key', `The ${table}`).replace('(', '').split(')=(').join(" '").replace(')', "'")
    return new BusinessError(table, message, StatusCodes.CONFLICT)
  }
}

export class InternalError {
  error = 'An unexpected error occurred. If this error persists, please contact support.'
  constructor() {}
}

export enum SystemErrorMessages {
  SYNTAX_ERROR = 'The request body contains malformed JSON. Correct the structure and try again.',
}
