import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { CreateWorkerSchema, UpdateWorkerSchema, WorkerResponseSchema, WorkerResponseDto } from './workerModel'
import { createOpenApiResponse, OpenApiResponseConfig } from '@/api-docs/openAPIResponseBuilders'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

export const workerRegistryV1 = new OpenAPIRegistry()

const workerPath = '/workers'

const workerOpenApiResponseSuccess: OpenApiResponseConfig<WorkerResponseDto> = {
  success: true,
  description: 'Success',
  dataSchema: WorkerResponseSchema as z.ZodType,
  statusCode: StatusCodes.CREATED,
}

const workerOpenApiResponseConflict: OpenApiResponseConfig<null> = {
  success: false,
  description: 'Conflict',
  dataSchema: z.null().openapi({ example: 'null' as unknown as null }),
  statusCode: StatusCodes.CONFLICT,
}

workerRegistryV1.register('CreateWorker', CreateWorkerSchema)

workerRegistryV1.registerPath({
  method: 'post',
  path: workerPath,
  tags: ['Workers'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateWorkerSchema,
        },
      },
    },
  },
  responses: createOpenApiResponse([workerOpenApiResponseSuccess, workerOpenApiResponseConflict]),
})
