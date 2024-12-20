import { env } from '@/common/utils/envConfig'
import { app, logger } from '@/server'
import { endDbConnection } from './common/utils/dbPool'

const server = app.listen(env.PORT, () => {
  const { NODE_ENV, HOST, PORT } = env
  logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`)
})

const onCloseSignal = () => {
  logger.info('sigint received, shutting down')
  server.close(async () => {
    await endDbConnection()
    logger.info('server closed')
    process.exit()
  })
  setTimeout(() => process.exit(1), 10000).unref() // Force shutdown after 10s
}

process.on('SIGINT', onCloseSignal)
process.on('SIGTERM', onCloseSignal)
