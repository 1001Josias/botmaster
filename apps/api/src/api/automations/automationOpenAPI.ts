import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { AutomationCreateSchema, AutomationSchema } from './automationModel'
import { createOpenApiResponse, OpenApiResponseConfig } from '@/api-docs/openAPIResponseBuilders'
import { StatusCodes } from 'http-status-codes'
import { IAutomation } from './automation'
import { z } from 'zod'

export const automationRegistryV1 = new OpenAPIRegistry()

const automationPath = '/api/v1/automations'

const automationOpenApiResponseSuccess: OpenApiResponseConfig<IAutomation> = {
  success: true,
  description: 'Success',
  dataSchema: AutomationSchema,
  statusCode: StatusCodes.OK,
}

const automationOpenApiResponseConflict: OpenApiResponseConfig<null> = {
  success: false,
  description: 'Conflict',
  dataSchema: z.null().openapi({ example: 'null' as unknown as null }),
  statusCode: StatusCodes.CONFLICT,
}

automationRegistryV1.registerPath({
  method: 'post',
  path: automationPath,
  tags: ['Automations'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: AutomationCreateSchema,
        },
      },
    },
  },
  responses: createOpenApiResponse([automationOpenApiResponseSuccess, automationOpenApiResponseConflict]),
})
