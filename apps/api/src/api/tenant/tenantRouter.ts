import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import express, { type Router } from 'express'

import { createOpenApiResponse } from '@/api-docs/openAPIResponseBuilders'
import { 
  GetTenantSchema, 
  TenantSchema, 
  CreateTenantSchema, 
  UpdateTenantSchema 
} from './tenantModel'
import { validateRequest } from '@/common/utils/httpHandlers'
import { tenantController } from './tenantController'

export const tenantRegistry = new OpenAPIRegistry()
export const tenantRouter: Router = express.Router()

const openApiResponseSuccess = {
  success: true,
  description: 'Success',
  dataSchema: TenantSchema,
  statusCode: 200,
}

const openApiResponseCreated = {
  success: true,
  description: 'Created',
  dataSchema: TenantSchema,
  statusCode: 201,
}

const openApiResponseDeleted = {
  success: true,
  description: 'Deleted',
  dataSchema: null,
  statusCode: 200,
}

tenantRegistry.register('Tenant', TenantSchema)

// GET /tenants
tenantRegistry.registerPath({
  method: 'get',
  path: '/tenants',
  tags: ['Tenant'],
  summary: 'Get all tenants',
  responses: createOpenApiResponse([{
    ...openApiResponseSuccess,
    dataSchema: TenantSchema.array(),
  }]),
})

tenantRouter.get('/', tenantController.getTenants)

// GET /tenants/:id
tenantRegistry.registerPath({
  method: 'get',
  path: '/tenants/{id}',
  tags: ['Tenant'],
  summary: 'Get tenant by ID',
  request: { params: GetTenantSchema.shape.params },
  responses: createOpenApiResponse([openApiResponseSuccess]),
})

tenantRouter.get('/:id', validateRequest(GetTenantSchema), tenantController.getTenant)

// POST /tenants
tenantRegistry.registerPath({
  method: 'post',
  path: '/tenants',
  tags: ['Tenant'],
  summary: 'Create a new tenant',
  request: { body: { content: { 'application/json': { schema: CreateTenantSchema.shape.body } } } },
  responses: createOpenApiResponse([openApiResponseCreated]),
})

tenantRouter.post('/', validateRequest(CreateTenantSchema), tenantController.createTenant)

// PUT /tenants/:id
tenantRegistry.registerPath({
  method: 'put',
  path: '/tenants/{id}',
  tags: ['Tenant'],
  summary: 'Update tenant by ID',
  request: { 
    params: UpdateTenantSchema.shape.params,
    body: { content: { 'application/json': { schema: UpdateTenantSchema.shape.body } } }
  },
  responses: createOpenApiResponse([openApiResponseSuccess]),
})

tenantRouter.put('/:id', validateRequest(UpdateTenantSchema), tenantController.updateTenant)

// DELETE /tenants/:id
tenantRegistry.registerPath({
  method: 'delete',
  path: '/tenants/{id}',
  tags: ['Tenant'],
  summary: 'Delete tenant by ID',
  request: { params: GetTenantSchema.shape.params },
  responses: createOpenApiResponse([openApiResponseDeleted]),
})

tenantRouter.delete('/:id', validateRequest(GetTenantSchema), tenantController.deleteTenant)