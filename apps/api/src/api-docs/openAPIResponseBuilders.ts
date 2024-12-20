import { Schema, z } from 'zod'

import { ServiceResponseSchema } from '@/common/models/serviceResponse'
import { StatusCodes } from 'http-status-codes'
import { InternalError } from '@/common/utils/errorHandlers'

export type OpenApiResponseConfig<T> = {
  success: boolean
  description: string
  dataSchema: Schema<T>
  statusCode: number
}

const internalError = new InternalError()

const automationResponseInternalError = {
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

export function createOpenApiResponse<T>(config: OpenApiResponseConfig<T>[]) {
  return config.reduce((acc, { success, description, dataSchema, statusCode }) => {
    console.log('dataSchema', acc)
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
  }, automationResponseInternalError)
}

// Use if you want multiple responses for a single endpoint

// import { ResponseConfig } from '@asteasolutions/zod-to-openapi';
// import { ApiResponseConfig } from '@common/models/openAPIResponseConfig';
// export type ApiResponseConfig = {
//   schema: z.ZodTypeAny;
//   description: string;
//   statusCode: StatusCodes;
// };
// export function createApiResponses(configs: ApiResponseConfig[]) {
//   const responses: { [key: string]: ResponseConfig } = {};
//   configs.forEach(({ schema, description, statusCode }) => {
//     responses[statusCode] = {
//       description,
//       content: {
//         'application/json': {
//           schema: ServiceResponseSchema(schema),
//         },
//       },
//     };
//   });
//   return responses;
// }
