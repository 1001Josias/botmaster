import type { PoolClient } from 'pg'
import { dbPool } from '@/common/utils/dbPool'
import { logger } from '@/server'
import type { 
  Trigger, 
  CreateTrigger, 
  UpdateTrigger, 
  TriggerStats,
  GetTriggersQuerySchema 
} from './triggerModel'
import { z } from 'zod'

type GetTriggersQuery = z.infer<typeof import('./triggerModel').GetTriggersQuerySchema>

export class TriggerRepository {
  // Convert database row to Trigger object
  private mapRowToTrigger(row: any): Trigger {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      type: row.type,
      targetType: row.target_type,
      workflowId: row.workflow_id,
      workerId: row.worker_id,
      status: row.status,
      isActive: row.is_active,
      scheduleFrequency: row.schedule_frequency,
      cronExpression: row.cron_expression,
      webhookEndpoint: row.webhook_endpoint,
      webhookMethod: row.webhook_method,
      webhookSecret: row.webhook_secret,
      eventSource: row.event_source,
      eventName: row.event_name,
      dataSource: row.data_source,
      dataCondition: row.data_condition,
      lastRunAt: row.last_run_at?.toISOString() || null,
      nextRunAt: row.next_run_at?.toISOString() || null,
      executionCount: row.execution_count,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
      createdBy: row.created_by,
      updatedBy: row.updated_by,
    }
  }

  async findAllAsync(query: GetTriggersQuery): Promise<{ data: Trigger[], total: number }> {
    let client: PoolClient | null = null
    
    try {
      client = await dbPool.connect()
      
      // Build WHERE clause
      const conditions: string[] = []
      const params: any[] = []
      let paramCount = 1

      if (query.type) {
        conditions.push(`type = $${paramCount}`)
        params.push(query.type)
        paramCount++
      }

      if (query.status) {
        conditions.push(`status = $${paramCount}`)
        params.push(query.status)
        paramCount++
      }

      if (query.targetType) {
        conditions.push(`target_type = $${paramCount}`)
        params.push(query.targetType)
        paramCount++
      }

      if (query.search) {
        conditions.push(`(name ILIKE $${paramCount} OR description ILIKE $${paramCount})`)
        params.push(`%${query.search}%`)
        paramCount++
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      
      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM triggers ${whereClause}`
      const countResult = await client.query(countQuery, params)
      const total = parseInt(countResult.rows[0].total)

      // Get paginated data
      const offset = (query.page - 1) * query.limit
      const dataQuery = `
        SELECT * FROM triggers 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `
      params.push(query.limit, offset)

      const dataResult = await client.query(dataQuery, params)
      const data = dataResult.rows.map(row => this.mapRowToTrigger(row))

      return { data, total }
    } catch (error) {
      logger.error('Error finding triggers:', error)
      throw error
    } finally {
      if (client) {
        client.release()
      }
    }
  }

  async findByIdAsync(id: number): Promise<Trigger | null> {
    let client: PoolClient | null = null
    
    try {
      client = await dbPool.connect()
      const result = await client.query('SELECT * FROM triggers WHERE id = $1', [id])
      
      if (result.rows.length === 0) {
        return null
      }

      return this.mapRowToTrigger(result.rows[0])
    } catch (error) {
      logger.error(`Error finding trigger with id ${id}:`, error)
      throw error
    } finally {
      if (client) {
        client.release()
      }
    }
  }

  async createAsync(trigger: CreateTrigger): Promise<Trigger> {
    let client: PoolClient | null = null
    
    try {
      client = await dbPool.connect()
      
      const query = `
        INSERT INTO triggers (
          name, description, type, target_type, workflow_id, worker_id, is_active,
          schedule_frequency, cron_expression, webhook_endpoint, webhook_method, webhook_secret,
          event_source, event_name, data_source, data_condition, created_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        ) RETURNING *
      `
      
      const values = [
        trigger.name,
        trigger.description || null,
        trigger.type,
        trigger.targetType,
        trigger.workflowId || null,
        trigger.workerId || null,
        trigger.isActive,
        trigger.scheduleFrequency || null,
        trigger.cronExpression || null,
        trigger.webhookEndpoint || null,
        trigger.webhookMethod || null,
        trigger.webhookSecret || null,
        trigger.eventSource || null,
        trigger.eventName || null,
        trigger.dataSource || null,
        trigger.dataCondition || null,
        trigger.createdBy || null,
      ]

      const result = await client.query(query, values)
      return this.mapRowToTrigger(result.rows[0])
    } catch (error) {
      logger.error('Error creating trigger:', error)
      throw error
    } finally {
      if (client) {
        client.release()
      }
    }
  }

  async updateAsync(id: number, trigger: UpdateTrigger): Promise<Trigger | null> {
    let client: PoolClient | null = null
    
    try {
      client = await dbPool.connect()
      
      // Build dynamic update query
      const updates: string[] = []
      const params: any[] = []
      let paramCount = 1

      Object.entries(trigger).forEach(([key, value]) => {
        if (value !== undefined) {
          // Convert camelCase to snake_case
          const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase()
          updates.push(`${dbField} = $${paramCount}`)
          params.push(value)
          paramCount++
        }
      })

      if (updates.length === 0) {
        return await this.findByIdAsync(id)
      }

      updates.push(`updated_at = NOW()`)
      params.push(id)

      const query = `
        UPDATE triggers 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `

      const result = await client.query(query, params)
      
      if (result.rows.length === 0) {
        return null
      }

      return this.mapRowToTrigger(result.rows[0])
    } catch (error) {
      logger.error(`Error updating trigger with id ${id}:`, error)
      throw error
    } finally {
      if (client) {
        client.release()
      }
    }
  }

  async deleteAsync(id: number): Promise<boolean> {
    let client: PoolClient | null = null
    
    try {
      client = await dbPool.connect()
      const result = await client.query('DELETE FROM triggers WHERE id = $1', [id])
      return result.rowCount !== null && result.rowCount > 0
    } catch (error) {
      logger.error(`Error deleting trigger with id ${id}:`, error)
      throw error
    } finally {
      if (client) {
        client.release()
      }
    }
  }

  async toggleStatusAsync(id: number, isActive: boolean, updatedBy?: string): Promise<Trigger | null> {
    let client: PoolClient | null = null
    
    try {
      client = await dbPool.connect()
      
      const query = `
        UPDATE triggers 
        SET is_active = $1, updated_at = NOW(), updated_by = $2
        WHERE id = $3
        RETURNING *
      `

      const result = await client.query(query, [isActive, updatedBy || null, id])
      
      if (result.rows.length === 0) {
        return null
      }

      return this.mapRowToTrigger(result.rows[0])
    } catch (error) {
      logger.error(`Error toggling trigger status for id ${id}:`, error)
      throw error
    } finally {
      if (client) {
        client.release()
      }
    }
  }

  async incrementExecutionCountAsync(id: number): Promise<void> {
    let client: PoolClient | null = null
    
    try {
      client = await dbPool.connect()
      
      const query = `
        UPDATE triggers 
        SET execution_count = execution_count + 1, 
            last_run_at = NOW(), 
            updated_at = NOW()
        WHERE id = $1
      `

      await client.query(query, [id])
    } catch (error) {
      logger.error(`Error incrementing execution count for trigger id ${id}:`, error)
      throw error
    } finally {
      if (client) {
        client.release()
      }
    }
  }

  async getStatsAsync(): Promise<TriggerStats> {
    let client: PoolClient | null = null
    
    try {
      client = await dbPool.connect()
      
      // Get basic stats
      const statsQuery = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
          COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive,
          COUNT(CASE WHEN status = 'error' THEN 1 END) as error,
          COUNT(CASE WHEN type = 'schedule' THEN 1 END) as schedule_count,
          COUNT(CASE WHEN type = 'webhook' THEN 1 END) as webhook_count,
          COUNT(CASE WHEN type = 'event' THEN 1 END) as event_count,
          COUNT(CASE WHEN type = 'data' THEN 1 END) as data_count,
          COALESCE(SUM(execution_count), 0) as total_executions
        FROM triggers
      `

      const result = await client.query(statsQuery)
      const row = result.rows[0]

      return {
        total: parseInt(row.total),
        active: parseInt(row.active),
        inactive: parseInt(row.inactive),
        error: parseInt(row.error),
        byType: {
          schedule: parseInt(row.schedule_count),
          webhook: parseInt(row.webhook_count),
          event: parseInt(row.event_count),
          data: parseInt(row.data_count),
        },
        totalExecutions: parseInt(row.total_executions),
      }
    } catch (error) {
      logger.error('Error getting trigger stats:', error)
      throw error
    } finally {
      if (client) {
        client.release()
      }
    }
  }
}