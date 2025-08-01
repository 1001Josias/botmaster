import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { 
  CreateJobSchema, 
  JobResponseSchema, 
  JobResponseDto, 
  JobKeyRouteParamsSchema,
  UpdateJobSchema,
  GetJobsRouteQuerySchema,
  JobStatsResponseSchema,
  JobStatsResponseDto 
} from './jobModel'
import { createOpenApiResponse, OpenApiResponseConfig } from '@/api-docs/openAPIResponseBuilders'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

export const jobRegistryV1 = new OpenAPIRegistry()

const jobPath = '/jobs'

const jobOpenApiResponseSuccess: OpenApiResponseConfig<JobResponseDto> = {
  success: true,
  description: 'Success',
  dataSchema: JobResponseSchema as z.ZodType,
  statusCode: StatusCodes.CREATED,
}

const jobOpenApiResponseSuccessGet: OpenApiResponseConfig<JobResponseDto> = {
  success: true,
  description: 'Success', 
  dataSchema: JobResponseSchema as z.ZodType,
  statusCode: StatusCodes.OK,
}

const jobOpenApiResponseNotFound: OpenApiResponseConfig<null> = {
  success: false,
  description: 'Not Found',
  dataSchema: z.null().openapi({ example: 'null' as unknown as null }),
  statusCode: StatusCodes.NOT_FOUND,
}

const jobStatsResponseSuccess: OpenApiResponseConfig<JobStatsResponseDto> = {
  success: true,
  description: 'Success',
  dataSchema: JobStatsResponseSchema as z.ZodType,
  statusCode: StatusCodes.OK,
}

const jobListResponseSuccess = {
  success: true,
  description: 'Success',
  dataSchema: z.object({
    jobs: z.array(JobResponseSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  }),
  statusCode: StatusCodes.OK,
}

jobRegistryV1.register('CreateJob', CreateJobSchema)
jobRegistryV1.register('UpdateJob', UpdateJobSchema)
jobRegistryV1.register('JobKeyRouteParams', JobKeyRouteParamsSchema)
jobRegistryV1.register('GetJobsQuery', GetJobsRouteQuerySchema)

// GET /jobs
jobRegistryV1.registerPath({
  method: 'get',
  path: jobPath,
  description: 'Get all jobs with optional filtering and pagination',
  summary: 'Get Jobs',
  request: {
    query: GetJobsRouteQuerySchema.shape.query,
  },
  responses: createOpenApiResponse([jobListResponseSuccess]),
  tags: ['Jobs'],
})

// GET /jobs/stats
jobRegistryV1.registerPath({
  method: 'get',
  path: `${jobPath}/stats`,
  description: 'Get job statistics',
  summary: 'Get Job Statistics',
  responses: createOpenApiResponse([jobStatsResponseSuccess]),
  tags: ['Jobs'],
})

// GET /jobs/:key
jobRegistryV1.registerPath({
  method: 'get',
  path: `${jobPath}/{key}`,
  description: 'Get a job by key',
  summary: 'Get Job by Key',
  request: {
    params: JobKeyRouteParamsSchema,
  },
  responses: createOpenApiResponse([jobOpenApiResponseSuccessGet, jobOpenApiResponseNotFound]),
  tags: ['Jobs'],
})

// POST /jobs
jobRegistryV1.registerPath({
  method: 'post',
  path: jobPath,
  description: 'Create a new job',
  summary: 'Create Job',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateJobSchema,
        },
      },
    },
  },
  responses: createOpenApiResponse([jobOpenApiResponseSuccess]),
  tags: ['Jobs'],
})

// PUT /jobs/:key
jobRegistryV1.registerPath({
  method: 'put',
  path: `${jobPath}/{key}`,
  description: 'Update a job',
  summary: 'Update Job',
  request: {
    params: JobKeyRouteParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: UpdateJobSchema,
        },
      },
    },
  },
  responses: createOpenApiResponse([jobOpenApiResponseSuccessGet, jobOpenApiResponseNotFound]),
  tags: ['Jobs'],
})

// DELETE /jobs/:key
jobRegistryV1.registerPath({
  method: 'delete',
  path: `${jobPath}/{key}`,
  description: 'Delete a job',
  summary: 'Delete Job',
  request: {
    params: JobKeyRouteParamsSchema,
  },
  responses: createOpenApiResponse([
    {
      success: true,
      description: 'Success',
      dataSchema: z.null(),
      statusCode: StatusCodes.OK,
    },
    jobOpenApiResponseNotFound
  ]),
  tags: ['Jobs'],
})

// POST /jobs/:key/start
jobRegistryV1.registerPath({
  method: 'post',
  path: `${jobPath}/{key}/start`,
  description: 'Start a job',
  summary: 'Start Job',
  request: {
    params: JobKeyRouteParamsSchema,
  },
  responses: createOpenApiResponse([jobOpenApiResponseSuccessGet, jobOpenApiResponseNotFound]),
  tags: ['Jobs'],
})

// POST /jobs/:key/complete
jobRegistryV1.registerPath({
  method: 'post',
  path: `${jobPath}/{key}/complete`,
  description: 'Complete a job with result',
  summary: 'Complete Job',
  request: {
    params: JobKeyRouteParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            result: z.record(z.any()),
          }),
        },
      },
    },
  },
  responses: createOpenApiResponse([jobOpenApiResponseSuccessGet, jobOpenApiResponseNotFound]),
  tags: ['Jobs'],
})

// POST /jobs/:key/fail
jobRegistryV1.registerPath({
  method: 'post',
  path: `${jobPath}/{key}/fail`,
  description: 'Mark a job as failed with error message',
  summary: 'Fail Job',
  request: {
    params: JobKeyRouteParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
  responses: createOpenApiResponse([jobOpenApiResponseSuccessGet, jobOpenApiResponseNotFound]),
  tags: ['Jobs'],
})