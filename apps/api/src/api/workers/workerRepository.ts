import { DatabaseError } from 'pg'
import { logger } from '@/server'
import { CreateWorkerDto, WorkerResponseDto } from '@/api/workers/workerModel'
import { PostgresError } from '@/common/utils/errorHandlers'
import { readSqlFile } from '@/common/utils/sqlReader'
import { dbPool } from '@/common/utils/dbPool'
import { IWorker } from '@/api/workers/worker'

export class WorkerRepository implements IWorker<[CreateWorkerDto], Promise<WorkerResponseDto>> {
  async create(worker: CreateWorkerDto) {
    const created_by = 123 // TODO: Replace with actual user ID
    const updated_by = 123 // TODO: Replace with actual user ID
    const values = [
      worker.name,
      worker.folderKey,
      worker.description,
      worker.status,
      worker.tags,
      created_by,
      updated_by,
      worker.scope,
      worker.scopeRef,
    ]
    const querySql = readSqlFile(`${__dirname}/db/queries/insert_worker.sql`)
    try {
      const { rows } = await dbPool.query(querySql, values)
      const row = rows[0]
      logger.info(`Worker ${row.id} created!`)
      return {
        id: row.id,
        key: row.key,
        name: row.name,
        folderKey: row.folder_key,
        description: row.description,
        createdBy: row.created_by,
        updatedBy: row.updated_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        status: row.status,
        tags: row.tags,
        scope: row.scope,
        scopeRef: row.scope_ref,
      }
    } catch (err) {
      if (err instanceof DatabaseError) {
        throw PostgresError.toBusinessError(err)
      }
      throw err
    }
  }
}
