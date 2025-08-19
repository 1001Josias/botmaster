import { PoolClient } from 'pg'
import { logger } from '@/server'
import { 
  CreateQueueDto, 
  UpdateQueueDto, 
  QueueDatabaseDto, 
  QueueResponseDto, 
  QueueStatsDto,
  QueueStatusType 
} from './queueModel'
import { BaseRepository } from '@/common/repositories/baseRepository'
import { readSqlFile } from '@/common/utils/sqlReader'

const queueCreateQuery = readSqlFile(`${__dirname}/db/queries/insert_queue.sql`)
const getQueueByKeyQuery = readSqlFile(`${__dirname}/db/queries/get_queue_by_key.sql`)
const getQueueByIdQuery = readSqlFile(`${__dirname}/db/queries/get_queue_by_id.sql`)
const getQueuesQuery = readSqlFile(`${__dirname}/db/queries/get_queues.sql`)
const updateQueueQuery = readSqlFile(`${__dirname}/db/queries/update_queue.sql`)
const deleteQueueQuery = readSqlFile(`${__dirname}/db/queries/delete_queue.sql`)
const updateQueueStatusQuery = readSqlFile(`${__dirname}/db/queries/update_queue_status.sql`)
const getQueueStatsQuery = readSqlFile(`${__dirname}/db/queries/get_queue_stats.sql`)

export interface IQueueRepository {
  create(queue: CreateQueueDto): Promise<QueueResponseDto>
  getById(id: number): Promise<QueueResponseDto | null>
  getByKey(key: string): Promise<QueueResponseDto | null>
  getAll(options: {
    page: number
    limit: number
    status?: QueueStatusType
    folderKey?: string
    search?: string
  }): Promise<{ queues: QueueResponseDto[], total: number }>
  update(id: number, updates: UpdateQueueDto): Promise<QueueResponseDto>
  delete(id: number): Promise<void>
  updateStatus(id: number, status: QueueStatusType): Promise<QueueResponseDto>
  getStats(id: number): Promise<QueueStatsDto>
}

export class QueueRepository extends BaseRepository implements IQueueRepository {
  constructor(protected readonly database: PoolClient) {
    super(database)
  }

  private mapDatabaseToResponse(row: QueueDatabaseDto): QueueResponseDto {
    return {
      id: row.id,
      key: row.key,
      name: row.name,
      folderKey: row.folder_key,
      description: row.description,
      status: row.status,
      concurrency: row.concurrency,
      retryLimit: row.retry_limit,
      retryDelay: row.retry_delay,
      priority: row.priority,
      isActive: row.is_active,
      tags: row.tags,
      metadata: row.metadata,
      createdBy: row.created_by,
      updatedBy: row.updated_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  async create(queue: CreateQueueDto): Promise<QueueResponseDto> {
    const created_by = 123 // TODO: Replace with actual user ID from context
    const updated_by = 123 // TODO: Replace with actual user ID from context
    
    const values = [
      queue.name,
      queue.description,
      queue.concurrency,
      queue.retryLimit,
      queue.retryDelay,
      queue.priority,
      queue.isActive,
      queue.tags,
      queue.metadata,
      created_by,
      updated_by,
    ]
    
    const { rows } = await this.query<QueueDatabaseDto>(queueCreateQuery, values)
    const row = rows[0]
    logger.info(`Queue ${row.id} created!`)
    
    return this.mapDatabaseToResponse(row)
  }

  async getById(id: number): Promise<QueueResponseDto | null> {
    try {
      const { rows } = await this.query<QueueDatabaseDto>(getQueueByIdQuery, [id])
      if (rows.length === 0) {
        return null
      }
      return this.mapDatabaseToResponse(rows[0])
    } catch (error) {
      logger.error(`Error getting queue by id ${id}:`, error)
      return null
    }
  }

  async getByKey(key: string): Promise<QueueResponseDto | null> {
    try {
      const { rows } = await this.query<QueueDatabaseDto>(getQueueByKeyQuery, [key])
      if (rows.length === 0) {
        return null
      }
      return this.mapDatabaseToResponse(rows[0])
    } catch (error) {
      logger.error(`Error getting queue by key ${key}:`, error)
      return null
    }
  }

  async getAll(options: {
    page: number
    limit: number
    status?: QueueStatusType
    folderKey?: string
    search?: string
  }): Promise<{ queues: QueueResponseDto[], total: number }> {
    const offset = (options.page - 1) * options.limit
    const values = [
      options.status || null,
      options.folderKey || null,
      options.search || null,
      options.limit,
      offset,
    ]

    try {
      const { rows } = await this.query<QueueDatabaseDto & {
        pending_count: number
        processing_count: number
        completed_count: number
        failed_count: number
      }>(getQueuesQuery, values)

      const queues = rows.map(row => this.mapDatabaseToResponse(row))
      
      // Get total count (simplified - in production you'd want a separate count query)
      const total = rows.length > 0 ? rows.length : 0

      return { queues, total }
    } catch (error) {
      logger.error('Error getting queues:', error)
      return { queues: [], total: 0 }
    }
  }

  async update(id: number, updates: UpdateQueueDto): Promise<QueueResponseDto> {
    const updated_by = 123 // TODO: Replace with actual user ID from context
    
    const values = [
      id,
      updates.name,
      updates.description,
      updates.concurrency,
      updates.retryLimit,
      updates.retryDelay,
      updates.priority,
      updates.isActive,
      updates.tags,
      updates.metadata,
      updated_by,
    ]
    
    const { rows } = await this.query<QueueDatabaseDto>(updateQueueQuery, values)
    const row = rows[0]
    logger.info(`Queue ${row.id} updated!`)
    
    return this.mapDatabaseToResponse(row)
  }

  async delete(id: number): Promise<void> {
    await this.query(deleteQueueQuery, [id])
    logger.info(`Queue ${id} deleted!`)
  }

  async updateStatus(id: number, status: QueueStatusType): Promise<QueueResponseDto> {
    const updated_by = 123 // TODO: Replace with actual user ID from context
    const values = [id, status, updated_by]
    
    const { rows } = await this.query<QueueDatabaseDto>(updateQueueStatusQuery, values)
    const row = rows[0]
    logger.info(`Queue ${row.id} status updated to ${status}!`)
    
    return this.mapDatabaseToResponse(row)
  }

  async getStats(id: number): Promise<QueueStatsDto> {
    const { rows } = await this.query<{
      total_pending: number
      total_processing: number
      total_completed: number
      total_failed: number
      avg_processing_time: number
    }>(getQueueStatsQuery, [id])
    
    const row = rows[0]
    return {
      totalPending: parseInt(row.total_pending.toString()),
      totalProcessing: parseInt(row.total_processing.toString()),
      totalCompleted: parseInt(row.total_completed.toString()),
      totalFailed: parseInt(row.total_failed.toString()),
      avgProcessingTime: parseFloat(row.avg_processing_time.toString()),
    }
  }
}