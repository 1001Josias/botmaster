import { DatabaseError, PoolClient } from 'pg'
import { dbPool } from '../utils/dbPool'
import { PostgresError } from '../utils/errorHandlers'
import { logger } from '@/server'

export abstract class BaseRepository {
  static async transaction<T, Repo>(
    this: new (client: PoolClient) => Repo,
    callback: (repository: Repo) => Promise<T>
  ): Promise<T> {
    const client = await dbPool.connect()
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
      client.release()
      logger.error(`Transaction failed in ${this.name}: ${err}`)
      if (err instanceof DatabaseError) {
        throw PostgresError.toBusinessError(err)
      }
      throw err
    } finally {
      client.release()
    }
  }
}
