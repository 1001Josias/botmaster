import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'

import { healthCheckRegistry } from '@/api/healthCheck/healthCheckRouter'
import { userRegistry } from '@/api/user/userRouter'
import { automationRegistryV1 } from '@/api/automations/automationOpenAPI'

export function generateOpenAPIDocumentV1() {
  const registryV1 = new OpenAPIRegistry([healthCheckRegistry, userRegistry, automationRegistryV1])
  const generatorV1 = new OpenApiGeneratorV3(registryV1.definitions)

  return generatorV1.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Swagger API',
    },
    externalDocs: {
      description: 'View the raw OpenAPI Specification in JSON format',
      url: '/swagger.json',
    },
  })
}
