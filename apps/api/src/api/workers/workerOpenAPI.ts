import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import {
  CreateWorkerSchema,
  WorkerResponseSchema,
  WorkerResponseDto,
  WorkerKeyRouteParamsSchema,
  GetWorkersRouteQuerySchema,
  PaginatedWorkersResponseSchema,
  PaginatedWorkersResponseDto,
} from './workerModel'
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

const workerOpenApiResponseSuccessGet: OpenApiResponseConfig<WorkerResponseDto> = {
  success: true,
  description: 'Success',
  dataSchema: WorkerResponseSchema as z.ZodType,
  statusCode: StatusCodes.OK,
}

const workersListOpenApiResponseSuccess: OpenApiResponseConfig<PaginatedWorkersResponseDto> = {
  success: true,
  description: 'Paginated list of workers retrieved successfully',
  dataSchema: PaginatedWorkersResponseSchema as z.ZodType,
  statusCode: StatusCodes.OK,
}

const workerOpenApiResponseNotFound: OpenApiResponseConfig<null> = {
  success: false,
  description: 'Not Found',
  dataSchema: z.null().openapi({ example: 'null' as unknown as null }),
  statusCode: StatusCodes.NOT_FOUND,
}

const workerOpenApiResponseConflict: OpenApiResponseConfig<null> = {
  success: false,
  description: 'Conflict',
  dataSchema: z.null().openapi({ example: 'null' as unknown as null }),
  statusCode: StatusCodes.CONFLICT,
}

workerRegistryV1.register('CreateWorker', CreateWorkerSchema)
workerRegistryV1.register('WorkerKeyRouteParams', WorkerKeyRouteParamsSchema)
workerRegistryV1.register('GetWorkersQuery', GetWorkersRouteQuerySchema)
workerRegistryV1.register('PaginatedWorkersResponse', PaginatedWorkersResponseSchema)

const contextHeaders = {
  'x-folder-key': contextSchema.shape.folderKey.openapi({ description: 'Folder identifier (context)' }),
}

// GET /workers
workerRegistryV1.registerPath({
  method: 'get',
  path: workerPath,
  tags: ['Workers'],
  summary: 'List workers with pagination',
  description:
    'Retrieve a paginated list of workers available in the current context. Supports up to 100 items per page.',
  request: {
    query: GetWorkersRouteQuerySchema,
    headers: z.object(contextHeaders),
  },
  responses: createOpenApiResponse([workersListOpenApiResponseSuccess, workerOpenApiResponseNotFound]),
})

// POST /workers
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

// GET /workers/{key}
workerRegistryV1.registerPath({
  method: 'get',
  path: `${workerPath}/{key}`,
  tags: ['Workers'],
  request: {
    params: WorkerKeyRouteParamsSchema,
    headers: z.object(contextHeaders),
  },
  responses: createOpenApiResponse([workerOpenApiResponseSuccessGet, workerOpenApiResponseNotFound]),
})
