import { Pool } from 'pg'
import { env } from './envConfig'
import { logger } from '@/server'

const dbPool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  database: env.DB_NAME,
  password: env.DB_PASSWORD,
  max: env.DB_MAX_CONNECTIONS,
  idleTimeoutMillis: env.DB_IDLE_TIMEOUT,
  connectionTimeoutMillis: env.DB_CONNECTION_TIMEOUT,
})

export async function getDbConnection() {
  try {
    return await dbPool.connect()
  } catch (err) {
    throw new Error(`Error getting database connection: ${err}`)
  }
}

export async function endDbConnection() {
  try {
    await dbPool.end()
  } catch (err) {
    logger.error(`Error ending database connection: ${err}`)
  }
}
