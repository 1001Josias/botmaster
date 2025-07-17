import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import {
  WorkerInstallationSchema,
  WorkerInstallationResponseSchema,
  DeleteWorkerInstallationParamsSchema,
} from './workerInstallationModel'
import { createOpenApiResponse } from '@/api-docs/openAPIResponseBuilders'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { contextSchema } from '@/common/utils/commonValidation'

export const workerInstallationRegistry = new OpenAPIRegistry()

const workerInstallationPath = '/workers/installations'

const workerInstallationOpenApiResponseSuccess = {
  success: true,
  description: 'Worker installed successfully',
  dataSchema: WorkerInstallationResponseSchema as z.ZodType,
  statusCode: StatusCodes.CREATED,
}

const workerUninstallationOpenApiResponseSuccess = {
  success: true,
  description: 'Worker uninstalled successfully',
  dataSchema: WorkerInstallationResponseSchema,
  statusCode: StatusCodes.OK,
}

const workerInstallationsListOpenApiResponseSuccess = {
  success: true,
  description: 'Installed workers fetched successfully',
  dataSchema: z.array(WorkerInstallationResponseSchema),
  statusCode: StatusCodes.OK,
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

const contextHeadersWithoutWorkerKey = z.object({
  'x-folder-key': contextSchema.shape.folderKey,
})

workerInstallationRegistry.registerPath({
  method: 'delete',
  path: `${workerInstallationPath}/{workerKey}`,
  tags: ['Workers, installations'],
  request: {
    headers: contextHeadersWithoutWorkerKey,
    params: DeleteWorkerInstallationParamsSchema,
  },
  responses: createOpenApiResponse([workerUninstallationOpenApiResponseSuccess]),
})

workerInstallationRegistry.registerPath({
  method: 'get',
  path: workerInstallationPath,
  tags: ['Workers, installations'],
  request: {
    headers: z.object({
      'x-folder-key': contextSchema.shape.folderKey,
    }),
  },
  responses: createOpenApiResponse([workerInstallationsListOpenApiResponseSuccess]),
})
