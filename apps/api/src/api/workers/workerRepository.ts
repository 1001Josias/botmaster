import { PoolClient } from 'pg'
import { logger } from '@/server'
import { CreateWorkerDto, WorkerDatabaseDto, WorkerResponseDto, UpdateWorkerDto, UpdateWorkerStatusDto, GetWorkersRouteQuerySchema } from '@/api/workers/workerModel'
import { IWorker } from '@/api/workers/worker'
import { BaseRepository } from '@/common/repositories/baseRepository'
import { readSqlFile } from '@/common/utils/sqlReader'
import { z } from 'zod'

const workerCreateQuery = readSqlFile(`${__dirname}/db/queries/insert_worker.sql`)
const workerExistsQuery = readSqlFile(`${__dirname}/db/queries/worker_exists.sql`)
const getWorkerByKeyQuery = readSqlFile(`${__dirname}/db/queries/get_worker_by_key.sql`)
const getWorkerByIdQuery = readSqlFile(`${__dirname}/db/queries/get_worker_by_id.sql`)
const getAllWorkersQuery = readSqlFile(`${__dirname}/db/queries/get_all_workers.sql`)
const updateWorkerQuery = readSqlFile(`${__dirname}/db/queries/update_worker.sql`)
const updateWorkerStatusQuery = readSqlFile(`${__dirname}/db/queries/update_worker_status.sql`)
const deleteWorkerQuery = readSqlFile(`${__dirname}/db/queries/delete_worker.sql`)

type GetWorkersQuery = z.infer<typeof GetWorkersRouteQuerySchema>

export interface PaginatedWorkerResponse {
  workers: WorkerResponseDto[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class WorkerRepository extends BaseRepository implements IWorker<any, Promise<WorkerResponseDto | null>> {
  constructor(protected readonly database: PoolClient) {
    super(database)
  }

  private transformDatabaseToResponse(row: WorkerDatabaseDto): WorkerResponseDto {
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
  }

  async create(worker: CreateWorkerDto): Promise<WorkerResponseDto> {
    const created_by = 123 // TODO: Replace with actual user ID
    const updated_by = 123 // TODO: Replace with actual user ID
    const values = [
      worker.name,
      worker.description,
      worker.status,
      worker.tags,
      created_by,
      updated_by,
      worker.scope,
      worker.scopeRef,
    ]
    const { rows } = await this.query<WorkerDatabaseDto>(workerCreateQuery, values)
    const row = rows[0]
    logger.info(`Worker ${row.id} created!`)
    return this.transformDatabaseToResponse(row)
  }

  async getAll(queryParams: GetWorkersQuery): Promise<PaginatedWorkerResponse> {
    const { page, limit, search, status, scope, folderKey, sortBy, sortOrder } = queryParams
    const offset = (page - 1) * limit

    const values = [
      search || null,
      status || null,
      scope || null,
      folderKey || null,
      sortBy,
      sortOrder,
      limit,
      offset,
    ]

    const { rows } = await this.query<WorkerDatabaseDto & { total_count: string }>(getAllWorkersQuery, values)
    
    const workers = rows.map(row => this.transformDatabaseToResponse(row))
    const total = rows.length > 0 ? parseInt(rows[0].total_count) : 0
    const totalPages = Math.ceil(total / limit)

    return {
      workers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      }
    }
  }

  async getById(id: number): Promise<WorkerResponseDto | null> {
    const { rows } = await this.query<WorkerDatabaseDto>(getWorkerByIdQuery, [id])
    if (rows.length === 0) {
      return null
    }
    return this.transformDatabaseToResponse(rows[0])
  }

  async getByKey(key: string): Promise<WorkerResponseDto | null> {
    const { rows } = await this.query<WorkerDatabaseDto>(getWorkerByKeyQuery, [key])
    if (rows.length === 0) {
      return null
    }
    return this.transformDatabaseToResponse(rows[0])
  }

  async update(id: number, worker: UpdateWorkerDto): Promise<WorkerResponseDto | null> {
    const updated_by = 123 // TODO: Replace with actual user ID
    const values = [
      id,
      worker.name || null,
      worker.description || null,
      worker.status || null,
      worker.tags || null,
      updated_by,
    ]
    
    const { rows } = await this.query<WorkerDatabaseDto>(updateWorkerQuery, values)
    if (rows.length === 0) {
      return null
    }
    
    logger.info(`Worker ${id} updated!`)
    return this.transformDatabaseToResponse(rows[0])
  }

  async updateStatus(id: number, statusData: UpdateWorkerStatusDto): Promise<WorkerResponseDto | null> {
    const updated_by = 123 // TODO: Replace with actual user ID
    const values = [id, statusData.status, updated_by]
    
    const { rows } = await this.query<WorkerDatabaseDto>(updateWorkerStatusQuery, values)
    if (rows.length === 0) {
      return null
    }
    
    logger.info(`Worker ${id} status updated to ${statusData.status}!`)
    return this.transformDatabaseToResponse(rows[0])
  }

  async delete(id: number): Promise<WorkerResponseDto | null> {
    const { rows } = await this.query<WorkerDatabaseDto>(deleteWorkerQuery, [id])
    if (rows.length === 0) {
      return null
    }
    
    logger.info(`Worker ${id} deleted!`)
    return this.transformDatabaseToResponse(rows[0])
  }

  async exists(workerId: string): Promise<boolean> {
    const result = await this.query(workerExistsQuery, [workerId])
    if (result.rowCount === null) throw new Error('Worker existence check returned null row count.')
    return result.rowCount > 0
  }
}
