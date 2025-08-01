import { PoolClient } from 'pg'
import { logger } from '@/server'
import { 
  CreateQueueItemDto, 
  UpdateQueueItemDto, 
  QueueItemDatabaseDto, 
  QueueItemResponseDto,
  QueueItemsResponseDto,
  QueueItemStatusType,
  QueueItemFiltersDto
} from './queueItemModel'
import { BaseRepository } from '@/common/repositories/baseRepository'
import { readSqlFile } from '@/common/utils/sqlReader'

const insertQueueItemQuery = readSqlFile(`${__dirname}/db/queries/insert_queue_item.sql`)
const getQueueItemByIdQuery = readSqlFile(`${__dirname}/db/queries/get_queue_item_by_id.sql`)
const getQueueItemsQuery = readSqlFile(`${__dirname}/db/queries/get_queue_items.sql`)
const countQueueItemsQuery = readSqlFile(`${__dirname}/db/queries/count_queue_items.sql`)
const updateQueueItemQuery = readSqlFile(`${__dirname}/db/queries/update_queue_item.sql`)
const deleteQueueItemQuery = readSqlFile(`${__dirname}/db/queries/delete_queue_item.sql`)
const retryQueueItemQuery = readSqlFile(`${__dirname}/db/queries/retry_queue_item.sql`)
const cancelQueueItemQuery = readSqlFile(`${__dirname}/db/queries/cancel_queue_item.sql`)

export interface IQueueItemRepository {
  create(queueItem: CreateQueueItemDto): Promise<QueueItemResponseDto>
  getById(id: number): Promise<QueueItemResponseDto | null>
  getAll(filters: QueueItemFiltersDto): Promise<QueueItemsResponseDto>
  update(id: number, updates: UpdateQueueItemDto): Promise<QueueItemResponseDto>
  delete(id: number): Promise<void>
  retry(id: number): Promise<QueueItemResponseDto>
  cancel(id: number): Promise<QueueItemResponseDto>
}

export class QueueItemRepository extends BaseRepository implements IQueueItemRepository {
  constructor(protected readonly database: PoolClient) {
    super(database)
  }

  private mapDatabaseToResponse(row: QueueItemDatabaseDto): QueueItemResponseDto {
    return {
      id: row.id,
      queueId: row.queue_id,
      jobId: row.job_id,
      jobName: row.job_name,
      workerId: row.worker_id,
      workerName: row.worker_name,
      workerVersion: row.worker_version,
      status: row.status,
      payload: row.payload,
      result: row.result,
      errorMessage: row.error_message,
      attempts: row.attempts,
      maxAttempts: row.max_attempts,
      priority: row.priority,
      tags: row.tags,
      metadata: row.metadata,
      processingTime: row.processing_time,
      startedAt: row.started_at,
      finishedAt: row.finished_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  async create(queueItem: CreateQueueItemDto): Promise<QueueItemResponseDto> {
    const values = [
      queueItem.queueId,
      queueItem.jobId,
      queueItem.jobName,
      queueItem.workerId,
      queueItem.workerName,
      queueItem.workerVersion,
      queueItem.payload,
      queueItem.maxAttempts,
      queueItem.priority,
      queueItem.tags,
      queueItem.metadata,
    ]
    
    const { rows } = await this.query<QueueItemDatabaseDto>(insertQueueItemQuery, values)
    const row = rows[0]
    logger.info(`Queue item ${row.id} created!`)
    
    return this.mapDatabaseToResponse(row)
  }

  async getById(id: number): Promise<QueueItemResponseDto | null> {
    try {
      const { rows } = await this.query<QueueItemDatabaseDto>(getQueueItemByIdQuery, [id])
      if (rows.length === 0) {
        return null
      }
      return this.mapDatabaseToResponse(rows[0])
    } catch (error) {
      logger.error(`Error getting queue item by id ${id}:`, error)
      return null
    }
  }

  async getAll(filters: QueueItemFiltersDto): Promise<QueueItemsResponseDto> {
    const offset = (filters.page - 1) * filters.pageSize
    
    // Parse date strings if provided
    const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null
    const dateTo = filters.dateTo ? new Date(filters.dateTo) : null
    
    const queryValues = [
      null, // queueId - we'll add this filter later if needed
      null, // workerId - we'll add this filter later if needed  
      filters.jobId || null,
      dateFrom,
      dateTo,
      filters.searchTerm || null,
      filters.status || null,
      filters.pageSize,
      offset,
    ]

    const countValues = [
      null, // queueId
      null, // workerId
      filters.jobId || null,
      dateFrom,
      dateTo,
      filters.searchTerm || null,
      filters.status || null,
    ]

    try {
      // Get items
      const { rows: itemRows } = await this.query<QueueItemDatabaseDto>(getQueueItemsQuery, queryValues)
      const items = itemRows.map(row => this.mapDatabaseToResponse(row))
      
      // Get total count
      const { rows: countRows } = await this.query<{ total: number }>(countQueueItemsQuery, countValues)
      const total = parseInt(countRows[0]?.total?.toString() || '0')
      
      const totalPages = Math.ceil(total / filters.pageSize)

      return {
        items,
        total,
        page: filters.page,
        pageSize: filters.pageSize,
        totalPages,
      }
    } catch (error) {
      logger.error('Error getting queue items:', error)
      return {
        items: [],
        total: 0,
        page: filters.page,
        pageSize: filters.pageSize,
        totalPages: 0,
      }
    }
  }

  async update(id: number, updates: UpdateQueueItemDto): Promise<QueueItemResponseDto> {
    const values = [
      id,
      updates.status,
      updates.result,
      updates.errorMessage,
      updates.attempts,
      updates.processingTime,
      updates.startedAt,
      updates.finishedAt,
    ]
    
    const { rows } = await this.query<QueueItemDatabaseDto>(updateQueueItemQuery, values)
    const row = rows[0]
    logger.info(`Queue item ${row.id} updated!`)
    
    return this.mapDatabaseToResponse(row)
  }

  async delete(id: number): Promise<void> {
    await this.query(deleteQueueItemQuery, [id])
    logger.info(`Queue item ${id} deleted!`)
  }

  async retry(id: number): Promise<QueueItemResponseDto> {
    const { rows } = await this.query<QueueItemDatabaseDto>(retryQueueItemQuery, [id])
    const row = rows[0]
    logger.info(`Queue item ${row.id} reset for retry!`)
    
    return this.mapDatabaseToResponse(row)
  }

  async cancel(id: number): Promise<QueueItemResponseDto> {
    const { rows } = await this.query<QueueItemDatabaseDto>(cancelQueueItemQuery, [id])
    const row = rows[0]
    logger.info(`Queue item ${row.id} cancelled!`)
    
    return this.mapDatabaseToResponse(row)
  }
}