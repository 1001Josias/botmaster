import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'

import { healthCheckRegistry } from '@/api/healthCheck/healthCheckRouter'
import { userRegistry } from '@/api/user/userRouter'
import { workerRegistryV1 } from '@/api/workers/workerOpenAPI'
import { env } from '@/common/utils/envConfig'

export function generateOpenAPIDocumentV1() {
  const registryV1 = new OpenAPIRegistry([healthCheckRegistry, userRegistry, workerRegistryV1])
  const generatorV1 = new OpenApiGeneratorV3(registryV1.definitions)

  const baseUrl = `${env.BASE_URL}/api/v1`

  const openApiServersV1 = [
    {
      url: baseUrl,
      description: env.NODE_ENV,
    },
  ]

  return generatorV1.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Swagger API',
    },
    servers: openApiServersV1,
    externalDocs: {
      description: 'View the raw OpenAPI Specification in JSON format',
      url: '/api-docs/v1/swagger.json',
    },
  })
}
