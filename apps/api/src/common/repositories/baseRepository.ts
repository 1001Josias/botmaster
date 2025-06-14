import { DatabaseError, PoolClient } from 'pg'
import { dbPool } from '../utils/dbPool'
import { PostgresError } from '../utils/errorHandlers'
import { logger } from '@/server'

export abstract class BaseRepository {
  protected database: Pool | PoolClient
  constructor(database: Pool | PoolClient) {
    this.database = database
  }

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
      logger.error(`Transaction failed in ${this.name}: ${err}`)
      if (err instanceof DatabaseError) {
        throw PostgresError.toBusinessError(err)
      }
      throw err
    } finally {
      client.release()
    }
  }

  async lockEntity(entityKey: string): Promise<void> {
    const lockQuery = 'SELECT pg_advisory_xact_lock(hashtext($1));'
    if (!this.isTransactionClient(this.database)) {
      throw new Error('Locking can only be done within a transaction context')
    }
    try {
      await this.database.query(lockQuery, [entityKey])
      logger.info(`Entity locked with key: ${entityKey}`)
    } catch (err) {
      logger.error(`Failed to lock entity with key: ${entityKey}`)
      throw err
    }
  }

  private isTransactionClient(db: Pool | PoolClient): db is PoolClient {
    return typeof (db as PoolClient).release === 'function'
  }
}
