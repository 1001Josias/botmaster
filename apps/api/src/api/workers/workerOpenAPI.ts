import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { WorkerCreateSchema, WorkerSchema } from './workerModel'
import { createOpenApiResponse, OpenApiResponseConfig } from '@/api-docs/openAPIResponseBuilders'
import { StatusCodes } from 'http-status-codes'
import { IWorker } from './worker'
import { z } from 'zod'

export const workerRegistryV1 = new OpenAPIRegistry()

const workerPath = '/workers'

const workerOpenApiResponseSuccess: OpenApiResponseConfig<IWorker> = {
  success: true,
  description: 'Success',
  dataSchema: WorkerSchema,
  statusCode: StatusCodes.CREATED,
}

const workerOpenApiResponseConflict: OpenApiResponseConfig<null> = {
  success: false,
  description: 'Conflict',
  dataSchema: z.null().openapi({ example: 'null' as unknown as null }),
  statusCode: StatusCodes.CONFLICT,
}

workerRegistryV1.registerPath({
  method: 'post',
  path: workerPath,
  tags: ['Workers'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: WorkerCreateSchema,
        },
      },
    },
  },
  responses: createOpenApiResponse([workerOpenApiResponseSuccess, workerOpenApiResponseConflict]),
})
