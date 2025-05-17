import { DatabaseError } from 'pg'
import { logger } from '@/server'
import { CreateWorkerDto } from '@/api/workers/workerModel'
import { PostgresError } from '@/common/utils/errorHandlers'
import { readSqlFile } from '@/common/utils/sqlReader'
import { dbPool } from '@/common/utils/dbPool'
import { IWorker } from '@/api/workers/worker'

export class WorkerRepository implements IWorker<[CreateWorkerDto], Promise<CreateWorkerDto>> {
  async createWorker(worker: CreateWorkerDto) {
    const values = [
      worker.name,
      worker.description,
      worker.createdBy,
      worker.updatedBy,
      worker.folderKey,
      worker.tenantKey,
    ]
    const querySql = readSqlFile(`${__dirname}/db/insert_worker.sql`)
    try {
      const { rows } = await dbPool.query(querySql, values)
      const row = rows[0]
      logger.info(`Worker ${row.id} created!`)
      return {
        id: row.id,
        key: row.key,
        name: row.name,
        description: row.description,
        createdBy: row.created_by,
        updatedBy: row.updated_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        folderKey: row.folder_key,
        tenantKey: row.tenant_key,
      }
    } catch (err) {
      if (err instanceof DatabaseError) {
        throw PostgresError.toBusinessError(err)
      }
      throw err
    }
  }
}
