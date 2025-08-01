import { PoolClient } from 'pg'
import { logger } from '@/server'
import { CreateWorkerDto, WorkerDatabaseDto, WorkerResponseDto, GetWorkersQueryDto, PaginatedWorkersResponseDto } from '@/api/workers/workerModel'
import { IWorker } from '@/api/workers/worker'
import { BaseRepository } from '@/common/repositories/baseRepository'
import { readSqlFile } from '@/common/utils/sqlReader'

const workerCreateQuery = readSqlFile(`${__dirname}/db/queries/insert_worker.sql`)
const workerExistsQuery = readSqlFile(`${__dirname}/db/queries/worker_exists.sql`)
const getWorkerByKeyQuery = readSqlFile(`${__dirname}/db/queries/get_worker_by_key.sql`)
const getWorkersPaginatedQuery = readSqlFile(`${__dirname}/db/queries/get_workers_paginated.sql`)

export class WorkerRepository extends BaseRepository implements IWorker<any, Promise<WorkerResponseDto | null>> {
  constructor(protected readonly database: PoolClient) {
    super(database)
  }

  async create(worker: CreateWorkerDto) {
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

  async getByKey(key: string): Promise<WorkerResponseDto | null> {
    const { rows } = await this.query<WorkerDatabaseDto>(getWorkerByKeyQuery, [key])
    if (rows.length === 0) {
      return null
    }
    
    const row = rows[0]
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

  async getAll(query: GetWorkersQueryDto): Promise<PaginatedWorkersResponseDto> {
    const offset = (query.page - 1) * query.limit
    
    // Use direct database query since we need to handle empty results gracefully
    await this.ensureSessionContext()
    const { rows } = await this.database.query<WorkerDatabaseDto & { total_count: string }>(
      getWorkersPaginatedQuery, 
      [query.limit, offset]
    )
    
    const totalItems = rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0
    const totalPages = Math.ceil(totalItems / query.limit)
    
    const items: WorkerResponseDto[] = rows.map(row => ({
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
    }))

    // Calculate pagination metadata
    const previousPages: number[] = []
    const nextPages: number[] = []
    
    // Add up to 3 previous pages
    for (let i = Math.max(1, query.page - 3); i < query.page; i++) {
      previousPages.push(i)
    }
    
    // Add up to 3 next pages
    for (let i = query.page + 1; i <= Math.min(totalPages, query.page + 3); i++) {
      nextPages.push(i)
    }

    return {
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalPages,
        totalItems,
        previousPages,
        nextPages,
        firstPage: 1,
        lastPage: Math.max(1, totalPages),
      }
    }
  }

  async exists(workerId: string): Promise<boolean> {
    await this.ensureSessionContext()
    const result = await this.database.query(workerExistsQuery, [workerId])
    if (result.rowCount === null) throw new Error('Worker existence check returned null row count.')
    return result.rowCount > 0
  }
}
