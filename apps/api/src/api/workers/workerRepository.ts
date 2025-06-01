import { DatabaseError } from 'pg'
import { logger } from '@/server'
import { CreateWorkerDto, WorkerResponseDto } from '@/api/workers/workerModel'
import { PostgresError } from '@/common/utils/errorHandlers'
import { readSqlFile } from '@/common/utils/sqlReader'
import { dbPool } from '@/common/utils/dbPool'
import { IWorker } from '@/api/workers/worker'

export class WorkerRepository implements IWorker<[CreateWorkerDto], Promise<WorkerResponseDto>> {
  async createWorker(worker: CreateWorkerDto) {
    const created_by = 123 // TODO: Replace with actual user ID
    const updated_by = 123 // TODO: Replace with actual user ID
    const values = [
      worker.name,
      worker.description,
      worker.status,
      worker.priority,
      worker.allowedMachines,
      worker.tags,
      worker.properties,
      created_by,
      updated_by,
      worker.scope,
      worker.scopeRef,
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
        status: row.status,
        priority: row.priority,
        allowedMachines: row.allowed_machines,
        tags: row.tags,
        properties: row.properties,
        scope: row.scope,
      }
    } catch (err) {
      if (err instanceof DatabaseError) {
        throw PostgresError.toBusinessError(err)
      }
      throw err
    }
  }
}
