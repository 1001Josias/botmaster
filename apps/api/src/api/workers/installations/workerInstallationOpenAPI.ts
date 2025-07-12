import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { WorkerInstallationSchema, WorkerInstallationResponseSchema } from './workerInstallationModel'
import { createOpenApiResponse } from '@/api-docs/openAPIResponseBuilders'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { contextSchema } from '@/common/utils/commonValidation'

export const workerInstallationRegistry = new OpenAPIRegistry()

const workerInstallationPath = '/workers/installations'

const workerInstallationOpenApiResponseSuccess = {
  success: true,
  description: 'Success',
  dataSchema: WorkerInstallationResponseSchema as z.ZodType,
  statusCode: StatusCodes.CREATED,
}

const contextHeaders = {
  'x-folder-key': contextSchema.shape.folderKey.openapi({ description: 'Folder identifier (context)' }),
}

workerInstallationRegistry.registerPath({
  method: 'post',
  path: workerInstallationPath,
  tags: ['Workers, installations'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: WorkerInstallationSchema,
        },
      },
    },
    headers: z.object(contextHeaders),
  },
  responses: createOpenApiResponse([workerInstallationOpenApiResponseSuccess]),
})
