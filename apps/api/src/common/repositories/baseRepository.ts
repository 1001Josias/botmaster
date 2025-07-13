import { Pool, PoolClient, QueryConfig, QueryResultRow } from 'pg'
import { dbPool } from '../utils/dbPool'
import { logger } from '@/server'
import { readSqlFile } from '../utils/sqlReader'
import { ContextDto } from '../utils/commonValidation'

const setSessionContextQuery = readSqlFile(`${__dirname}/../queries/set_session_context.sql`)
const lockEntityQuery = readSqlFile(`${__dirname}/../queries/lock_entity.sql`)

export abstract class BaseRepository {
  protected database: Pool | PoolClient
  private sessionContext!: ContextDto
  private isSessionContextSet!: boolean

  constructor(database: PoolClient) {
    if (!database || typeof database.query !== 'function') {
      throw new Error(
        'Invalid database client provided. Must be a PoolClient. Use BaseRepository.transaction() or BaseRepository.session() to handle with this repository correctly.'
      )
    }
    this.database = database
  }

  public setContext(context: ContextDto) {
    this.sessionContext = context
    this.isSessionContextSet = false
  }

  static async transaction<T, Repo extends BaseRepository>(
    this: new (client: PoolClient) => Repo,
    context: ContextDto,
    callback: (repository: Repo) => Promise<T>
  ): Promise<T> {
    const client = await dbPool.connect()
    const repository = new this(client)
    try {
      await client.query('BEGIN')
      logger.debug(`Transaction started in ${this.name}`)
      repository.setContext(context)
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

  async lockEntity(key: string): Promise<void> {
    if (!this.isTransactionClient(this.database)) {
      throw new Error('Locking can only be done within a transaction context')
    }
    await this.database.query(lockEntityQuery, [key])
  }

  private isTransactionClient(db: Pool | PoolClient): db is PoolClient {
    return typeof (db as PoolClient).release === 'function'
  }

  async query<R extends QueryResultRow>(queryTextOrConfig: string | QueryConfig<any[]>, values?: any[]) {
    await this.ensureSessionContext()
    return await this.database.query<R>(queryTextOrConfig, values)
  }

  protected async ensureSessionContext(): Promise<void> {
    if (!this.isSessionContextSet) {
      await this.setSessionContext(this.sessionContext)
    }
  }

  private async setSessionContext(context: ContextDto): Promise<void> {
    await this.database.query(setSessionContextQuery, [context.folderKey, context.tenantKey, context.organization])
    this.isSessionContextSet = true
  }

  static async session<T, Repo extends BaseRepository>(
    this: new (client: PoolClient) => Repo,
    context: ContextDto,
    callback: (repository: Repo) => Promise<T>
  ): Promise<T> {
    const client = await dbPool.connect()
    const repository = new this(client)
    try {
      repository.setContext(context)
      const result = await callback(repository)
      return result
    } finally {
      logger.debug(`Releasing client in ${this.name}`)
      client.release()
    }
  }
}
