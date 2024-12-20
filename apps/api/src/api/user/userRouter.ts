import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import express, { type Router } from 'express'

import { createOpenApiResponse } from '@/api-docs/openAPIResponseBuilders'
import { GetUserSchema, UserSchema } from '@/api/user/userModel'
import { validateRequest } from '@/common/utils/httpHandlers'
import { userController } from './userController'

export const userRegistry = new OpenAPIRegistry()
export const userRouter: Router = express.Router()

const openApiResponseSuccess = {
  success: true,
  description: 'Success',
  dataSchema: UserSchema,
  statusCode: 200,
}

userRegistry.register('User', UserSchema)

userRegistry.registerPath({
  method: 'get',
  path: '/users',
  tags: ['User'],
  responses: createOpenApiResponse([openApiResponseSuccess]),
})

userRouter.get('/', userController.getUsers)

userRegistry.registerPath({
  method: 'get',
  path: '/users/{id}',
  tags: ['User'],
  request: { params: GetUserSchema.shape.params },
  responses: createOpenApiResponse([openApiResponseSuccess]),
})

userRouter.get('/:id', validateRequest(GetUserSchema), userController.getUser)
