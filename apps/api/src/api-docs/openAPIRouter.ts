import express, { type Request, type Response, type Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'
import { generateOpenAPIDocumentV1 } from '@/api-docs/openAPIDocumentGenerator'

export const openAPIRouterV1: Router = express.Router()
const openAPIDocumentV1 = generateOpenAPIDocumentV1()

const theme = new SwaggerTheme()
const optionsV1 = {
  explorer: true,
  customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
}

openAPIRouterV1.get('/swagger.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(openAPIDocumentV1)
})

openAPIRouterV1.use('/', swaggerUi.serve, swaggerUi.setup(openAPIDocumentV1, optionsV1))
