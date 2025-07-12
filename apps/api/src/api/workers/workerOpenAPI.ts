import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { CreateWorkerSchema, UpdateWorkerSchema, WorkerResponseSchema, WorkerResponseDto } from './workerModel'
import { createOpenApiResponse, OpenApiResponseConfig } from '@/api-docs/openAPIResponseBuilders'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { contextSchema } from '@/common/utils/commonValidation'

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
const contextHeaders = {
  'x-folder-key': contextSchema.shape.folderKey.openapi({ description: 'Folder identifier (context)' }),
}

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
    headers: z.object(contextHeaders),
  },
  responses: createOpenApiResponse([workerOpenApiResponseSuccess, workerOpenApiResponseConflict]),
})
