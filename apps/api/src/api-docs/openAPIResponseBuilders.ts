import { Schema, z } from 'zod'

import { ServiceResponseSchema } from '@/common/models/serviceResponse'
import { StatusCodes } from 'http-status-codes'
import { InternalError } from '@/common/utils/errorHandlers'

export type OpenApiResponseConfig<T = null> = {
  success: boolean
  description: string
  dataSchema: Schema<T> | z.ZodNull
  statusCode: number
}

const internalError = new InternalError()

const openApiResponseInternalError = {
  [StatusCodes.INTERNAL_SERVER_ERROR]: {
    description:
      'Thrown when an unexpected error occurs on the server. If this error persists, please contact support.',
    content: {
      'application/json': {
        schema: ServiceResponseSchema(
          false,
          'Internal error.',
          z.object({
            error: z.string().openapi({ example: internalError.error }),
          }),
          StatusCodes.INTERNAL_SERVER_ERROR,
        ),
      },
    },
  },
}

const openApiResponseNotFound = {
  [StatusCodes.NOT_FOUND]: {
    description: 'Thrown when the requested resource is not found.',
    content: {
      'application/json': {
        schema: ServiceResponseSchema(
          false,
          'Resource not found.',
          z.object({
            error: z.string().openapi({ example: 'Resource not found.' }),
          }),
          StatusCodes.NOT_FOUND,
        ),
      },
    },
  },
}

const openApiResponseBadRequest = {
  [StatusCodes.BAD_REQUEST]: {
    description: 'Thrown when the request is invalid.',
    content: {
      'application/json': {
        schema: ServiceResponseSchema(
          false,
          'Invalid request.',
          z.object({
            errors: z.array(z.string()),
          }),
          StatusCodes.BAD_REQUEST,
        ),
      },
    },
  },
}

export function createOpenApiResponse<T>(config: OpenApiResponseConfig<T>[]) {
  return config.reduce(
    (acc, { success, description, dataSchema, statusCode }) => {
      return {
        ...acc,
        [statusCode]: {
          description,
          content: {
            'application/json': {
              schema: ServiceResponseSchema(success, description, dataSchema, statusCode),
            },
          },
        },
      }
    },
    { ...openApiResponseInternalError, ...openApiResponseNotFound, ...openApiResponseBadRequest },
  )
}
