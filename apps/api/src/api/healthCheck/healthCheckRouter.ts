import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import express, { type Request, type Response, type Router } from 'express'
import { z } from 'zod'

import { createOpenApiResponse, OpenApiResponseConfig } from '@/api-docs/openAPIResponseBuilders'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { StatusCodes } from 'http-status-codes'

export const healthCheckRegistry = new OpenAPIRegistry()
export const healthCheckRouter: Router = express.Router()

const workerResponseSuccess: OpenApiResponseConfig<null> = {
  success: true,
  description: 'Success',
  dataSchema: z.null(),
  statusCode: StatusCodes.OK,
}

const workerResponseFailure: OpenApiResponseConfig<null> = {
  success: false,
  description: 'Failure',
  dataSchema: z.null(),
  statusCode: StatusCodes.BAD_REQUEST,
}

healthCheckRegistry.registerPath({
  method: 'get',
  path: '/health-check',
  tags: ['Health Check'],
  responses: createOpenApiResponse([workerResponseSuccess, workerResponseFailure]),
})

healthCheckRouter.get('/', (_req: Request, res: Response) => {
  const serviceResponse = ServiceResponse.success('Service is healthy', null)
  return handleServiceResponse(serviceResponse, res)
})
