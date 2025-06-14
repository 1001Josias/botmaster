import { DatabaseError, PoolClient } from 'pg'
import { getDbConnection } from '../utils/dbPool'
import { PostgresError } from '../utils/errorHandlers'
import { logger } from '@/server'

export abstract class BaseRepository {
  static async transaction<T, Repo>(
    this: new (client: PoolClient) => Repo,
    callback: (repository: Repo) => Promise<T>
  ): Promise<T> {
    const client = await getDbConnection()
    const repository = new this(client)
    try {
      await client.query('BEGIN')
      logger.info(`Transaction started in ${this.name}`)
      const result = await callback(repository)
      await client.query('COMMIT')
      logger.info(`Transaction completed in ${this.name}`)
      return result
    } catch (err) {
      await client.query('ROLLBACK')
      if (err instanceof DatabaseError) {
        throw PostgresError.toBusinessError(err)
      }
      throw err
    } finally {
      client.release()
    }
  }
}
