import express, { type Request, type Response, type Router } from 'express'
import swaggerUi from 'swagger-ui-express'

import { generateOpenAPIDocument } from '@/api-docs/openAPIDocumentGenerator'

export const openAPIRouterV1: Router = express.Router()
const openAPIDocument = generateOpenAPIDocument()

openAPIRouterV1.get('/swagger.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(openAPIDocument)
})

openAPIRouterV1.use('/', swaggerUi.serve, swaggerUi.setup(openAPIDocument))
