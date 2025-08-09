import { dbPool } from '@/common/utils/dbPool'
import type { 
  WebhookEvent, 
  CreateWebhookEvent, 
  BotResponseConfig, 
  CreateBotResponseConfig, 
  UpdateBotResponseConfig,
  GetWebhookEventsQuery 
} from './githubWebhookModel'

export class GitHubWebhookRepository {
  
  // Webhook Events methods
  async createWebhookEvent(data: CreateWebhookEvent): Promise<WebhookEvent> {
    const client = await dbPool.connect()
    try {
      const query = `
        INSERT INTO webhook_events (
          event_type, action, repository_full_name, issue_number, 
          comment_id, user_login, payload, bot_mentioned, 
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING *
      `
      const values = [
        data.event_type,
        data.action,
        data.repository_full_name,
        data.issue_number,
        data.comment_id,
        data.user_login,
        JSON.stringify(data.payload),
        data.bot_mentioned,
      ]
      
      const result = await client.query<WebhookEvent>(query, values)
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async findWebhookEventById(id: number): Promise<WebhookEvent | null> {
    const client = await dbPool.connect()
    try {
      const query = 'SELECT * FROM webhook_events WHERE id = $1'
      const result = await client.query<WebhookEvent>(query, [id])
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  async findWebhookEvents(filters: GetWebhookEventsQuery): Promise<{ events: WebhookEvent[], total: number }> {
    const client = await dbPool.connect()
    try {
      const conditions: string[] = []
      const values: any[] = []
      let paramCount = 1

      if (filters.repository) {
        conditions.push(`repository_full_name = $${paramCount}`)
        values.push(filters.repository)
        paramCount++
      }

      if (filters.event_type) {
        conditions.push(`event_type = $${paramCount}`)
        values.push(filters.event_type)
        paramCount++
      }

      if (filters.processed !== undefined) {
        conditions.push(`processed = $${paramCount}`)
        values.push(filters.processed)
        paramCount++
      }

      if (filters.bot_mentioned !== undefined) {
        conditions.push(`bot_mentioned = $${paramCount}`)
        values.push(filters.bot_mentioned)
        paramCount++
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM webhook_events ${whereClause}`
      const countResult = await client.query(countQuery, values)
      const total = parseInt(countResult.rows[0].total)

      // Get paginated results
      const dataQuery = `
        SELECT * FROM webhook_events 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `
      values.push(filters.limit, filters.offset)
      
      const dataResult = await client.query<WebhookEvent>(dataQuery, values)
      
      return {
        events: dataResult.rows,
        total
      }
    } finally {
      client.release()
    }
  }

  async updateWebhookEventProcessed(id: number, processed: boolean, responseSent?: boolean): Promise<WebhookEvent | null> {
    const client = await dbPool.connect()
    try {
      const setClause = responseSent !== undefined 
        ? 'processed = $2, response_sent = $3, updated_at = NOW()'
        : 'processed = $2, updated_at = NOW()'
      
      const query = `
        UPDATE webhook_events 
        SET ${setClause}
        WHERE id = $1
        RETURNING *
      `
      
      const values = responseSent !== undefined 
        ? [id, processed, responseSent]
        : [id, processed]
      
      const result = await client.query<WebhookEvent>(query, values)
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  // Bot Response Config methods
  async createBotResponseConfig(data: CreateBotResponseConfig): Promise<BotResponseConfig> {
    const client = await dbPool.connect()
    try {
      const query = `
        INSERT INTO bot_response_configs (
          repository_pattern, mention_keywords, response_template, 
          enabled, priority, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *
      `
      const values = [
        data.repository_pattern,
        JSON.stringify(data.mention_keywords),
        data.response_template,
        data.enabled,
        data.priority,
      ]
      
      const result = await client.query<BotResponseConfig>(query, values)
      return result.rows[0]
    } finally {
      client.release()
    }
  }

  async findBotResponseConfigById(id: number): Promise<BotResponseConfig | null> {
    const client = await dbPool.connect()
    try {
      const query = 'SELECT * FROM bot_response_configs WHERE id = $1'
      const result = await client.query<BotResponseConfig>(query, [id])
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  async findAllBotResponseConfigs(): Promise<BotResponseConfig[]> {
    const client = await dbPool.connect()
    try {
      const query = `
        SELECT * FROM bot_response_configs 
        WHERE enabled = true 
        ORDER BY priority DESC, created_at ASC
      `
      const result = await client.query<BotResponseConfig>(query)
      return result.rows
    } finally {
      client.release()
    }
  }

  async updateBotResponseConfig(id: number, data: UpdateBotResponseConfig): Promise<BotResponseConfig | null> {
    const client = await dbPool.connect()
    try {
      const updates: string[] = []
      const values: any[] = []
      let paramCount = 1

      if (data.repository_pattern !== undefined) {
        updates.push(`repository_pattern = $${paramCount}`)
        values.push(data.repository_pattern)
        paramCount++
      }

      if (data.mention_keywords !== undefined) {
        updates.push(`mention_keywords = $${paramCount}`)
        values.push(JSON.stringify(data.mention_keywords))
        paramCount++
      }

      if (data.response_template !== undefined) {
        updates.push(`response_template = $${paramCount}`)
        values.push(data.response_template)
        paramCount++
      }

      if (data.enabled !== undefined) {
        updates.push(`enabled = $${paramCount}`)
        values.push(data.enabled)
        paramCount++
      }

      if (data.priority !== undefined) {
        updates.push(`priority = $${paramCount}`)
        values.push(data.priority)
        paramCount++
      }

      if (updates.length === 0) {
        return await this.findBotResponseConfigById(id)
      }

      updates.push('updated_at = NOW()')
      values.push(id)

      const query = `
        UPDATE bot_response_configs 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `
      
      const result = await client.query<BotResponseConfig>(query, values)
      return result.rows[0] || null
    } finally {
      client.release()
    }
  }

  async deleteBotResponseConfig(id: number): Promise<boolean> {
    const client = await dbPool.connect()
    try {
      const query = 'DELETE FROM bot_response_configs WHERE id = $1'
      const result = await client.query(query, [id])
      return result.rowCount > 0
    } finally {
      client.release()
    }
  }

  async findMatchingBotResponseConfigs(repositoryFullName: string): Promise<BotResponseConfig[]> {
    const client = await dbPool.connect()
    try {
      const query = `
        SELECT * FROM bot_response_configs 
        WHERE enabled = true 
        AND (
          repository_pattern = '*' 
          OR repository_pattern = $1
          OR $1 LIKE replace(repository_pattern, '*', '%')
        )
        ORDER BY priority DESC, created_at ASC
      `
      const result = await client.query<BotResponseConfig>(query, [repositoryFullName])
      return result.rows
    } finally {
      client.release()
    }
  }
}

export const githubWebhookRepository = new GitHubWebhookRepository()