import cors from 'cors'
import express, { type Express } from 'express'
import helmet from 'helmet'
import { pino } from 'pino'

import { openAPIRouterV1 } from '@/api-docs/openAPIRouter'
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter'
import { userRouter } from '@/api/user/userRouter'
import errorHandler from '@/common/middleware/errorHandler'
import rateLimiter from '@/common/middleware/rateLimiter'
import requestLogger from '@/common/middleware/requestLogger'
import { env } from '@/common/utils/envConfig'
import { workersRouterV1 } from './api/workers/workerRoutes'
import { jobsRouterV1 } from './api/jobs/jobRoutes'
const logger = pino({ name: 'server start', level: env.NODE_ENV === 'production' ? 'info' : 'debug' })
const app: Express = express()
const apiRouterV1 = express.Router()

// Set the application to trust the reverse proxy
app.set('trust proxy', true)

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(helmet())
app.use(rateLimiter)

// Request logging
app.use(requestLogger)

// API Routes v1
apiRouterV1.use('/health-check', healthCheckRouter)
apiRouterV1.use('/workers', workersRouterV1)
apiRouterV1.use('/jobs', jobsRouterV1)
// Routes
app.use('/api/v1', apiRouterV1)

// Swagger UI
app.use('/api-docs/v1', openAPIRouterV1)

// Error handlers
app.use(errorHandler())

export { app, logger }
