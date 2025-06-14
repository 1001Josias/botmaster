import { DatabaseError, PoolClient } from 'pg'
import { getDbConnection } from '../utils/dbPool'
import { PostgresError } from '../utils/errorHandlers'

export abstract class BaseRepository {
  static async transaction<Repo>(
    this: new (client: PoolClient) => Repo,
    callback: (repository: Repo) => Promise<void>
  ): Promise<void> {
    const client = await getDbConnection()
    const repository = new this(client)
    try {
      await client.query('BEGIN')
      console.log(`Transaction started for repository`)
      await callback(repository)
      await client.query('COMMIT')
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
