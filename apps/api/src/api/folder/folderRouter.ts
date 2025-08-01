import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import express, { type Router } from 'express'
import { z } from 'zod'

import { createOpenApiResponse } from '@/api-docs/openAPIResponseBuilders'
import { 
  GetFolderSchema, 
  FolderSchema, 
  CreateFolderSchema, 
  UpdateFolderSchema 
} from './folderModel'
import { validateRequest } from '@/common/utils/httpHandlers'
import { folderController } from './folderController'

export const folderRegistry = new OpenAPIRegistry()
export const folderRouter: Router = express.Router()

const openApiResponseSuccess = {
  success: true,
  description: 'Success',
  dataSchema: FolderSchema,
  statusCode: 200,
}

const openApiResponseCreated = {
  success: true,
  description: 'Created',
  dataSchema: FolderSchema,
  statusCode: 201,
}

const openApiResponseDeleted = {
  success: true,
  description: 'Deleted',
  dataSchema: z.null(),
  statusCode: 200,
}

folderRegistry.register('Folder', FolderSchema)

// GET /folders
folderRegistry.registerPath({
  method: 'get',
  path: '/folders',
  tags: ['Folder'],
  summary: 'Get all folders',
  responses: createOpenApiResponse([{
    ...openApiResponseSuccess,
    dataSchema: FolderSchema.array(),
  }]),
})

folderRouter.get('/', folderController.getFolders)

// GET /folders/:id
folderRegistry.registerPath({
  method: 'get',
  path: '/folders/{id}',
  tags: ['Folder'],
  summary: 'Get folder by ID',
  request: { params: GetFolderSchema.shape.params },
  responses: createOpenApiResponse([openApiResponseSuccess]),
})

folderRouter.get('/:id', validateRequest(GetFolderSchema, 'params'), folderController.getFolder)

// POST /folders
folderRegistry.registerPath({
  method: 'post',
  path: '/folders',
  tags: ['Folder'],
  summary: 'Create a new folder',
  request: { body: { content: { 'application/json': { schema: CreateFolderSchema.shape.body } } } },
  responses: createOpenApiResponse([openApiResponseCreated]),
})

folderRouter.post('/', validateRequest(CreateFolderSchema, 'body'), folderController.createFolder)

// PUT /folders/:id
folderRegistry.registerPath({
  method: 'put',
  path: '/folders/{id}',
  tags: ['Folder'],
  summary: 'Update folder by ID',
  request: { 
    params: UpdateFolderSchema.shape.params,
    body: { content: { 'application/json': { schema: UpdateFolderSchema.shape.body } } }
  },
  responses: createOpenApiResponse([openApiResponseSuccess]),
})

folderRouter.put('/:id', validateRequest(UpdateFolderSchema, 'params'), folderController.updateFolder)

// DELETE /folders/:id
folderRegistry.registerPath({
  method: 'delete',
  path: '/folders/{id}',
  tags: ['Folder'],
  summary: 'Delete folder by ID',
  request: { params: GetFolderSchema.shape.params },
  responses: createOpenApiResponse([openApiResponseDeleted]),
})

folderRouter.delete('/:id', validateRequest(GetFolderSchema, 'params'), folderController.deleteFolder)