import { DatabaseError, Pool, PoolClient, QueryConfig, QueryResultRow } from 'pg'
import { dbPool } from '../utils/dbPool'
import { logger } from '@/server'
import { readSqlFile } from '../utils/sqlReader'
import { PostgresError } from '../utils/errorHandlers'

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
      logger.debug(`Transaction started in ${this.name}`)
      const result = await callback(repository)
      await client.query('COMMIT')
      logger.debug(`Transaction completed in ${this.name}`)
      return result
    } catch (err) {
      await client.query('ROLLBACK')
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
    await this.database.query(lockQuery, [entityKey])
  }

  private isTransactionClient(db: Pool | PoolClient): db is PoolClient {
    return typeof (db as PoolClient).release === 'function'
  }

  async query<R extends QueryResultRow>(queryTextOrConfig: string | QueryConfig<any[]>, values?: any[]) {
    try {
      return await this.database.query<R>(queryTextOrConfig, values)
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw PostgresError.toBusinessError(error)
      }
      throw error
    }
  }

  async queryFromFile<R extends QueryResultRow>(filePath: string, values?: any[]) {
    const sql = readSqlFile(filePath)
    return await this.query<R>(sql, values)
  }
}
