import { BaseRepository } from '@/common/repositories/baseRepository'
import { CreateJobDto, JobDatabaseDto, JobResponseDto, JobStatsResponseDto, JobStatus, UpdateJobDto } from './jobModel'
import { generateRandomId } from '@/common/utils/stringHandler'
import { PoolClient } from 'pg'

export class JobRepository extends BaseRepository {
  private readonly tableName = 'jobs'

  constructor(database: PoolClient) {
    super(database)
  }

  async create(job: CreateJobDto, userId: number): Promise<JobResponseDto> {
    const key = generateRandomId()
    const now = new Date()
    
    const query = `
      INSERT INTO ${this.tableName} (
        key, name, worker_key, flow_key, description, parameters, 
        status, progress, created_by, updated_by, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ) RETURNING *;
    `

    const params = [
      key,
      job.name,
      job.workerKey,
      job.flowKey,
      job.description,
      JSON.stringify(job.parameters),
      job.status,
      job.progress,
      userId,
      userId,
      now,
      now,
    ]

    const result = await this.database.query(query, params)
    return this.mapToResponseDto(result.rows[0])
  }

  async findByKey(key: string): Promise<JobResponseDto | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE key = $1`
    
    try {
      const result = await this.database.query(query, [key])
      return this.mapToResponseDto(result.rows[0])
    } catch (error) {
      return null
    }
  }

  async findById(id: number): Promise<JobResponseDto | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`
    
    try {
      const result = await this.database.query(query, [id])
      return this.mapToResponseDto(result.rows[0])
    } catch (error) {
      return null
    }
  }

  async findAll(
    page = 1,
    limit = 20,
    filters: {
      status?: JobStatus
      workerKey?: string
      flowKey?: string
    } = {}
  ): Promise<{ jobs: JobResponseDto[]; total: number }> {
    const offset = (page - 1) * limit
    let whereConditions: string[] = []
    let queryParams: any[] = []
    let paramIndex = 1

    // Build WHERE conditions
    if (filters.status) {
      whereConditions.push(`status = $${paramIndex}`)
      queryParams.push(filters.status)
      paramIndex++
    }

    if (filters.workerKey) {
      whereConditions.push(`worker_key = $${paramIndex}`)
      queryParams.push(filters.workerKey)
      paramIndex++
    }

    if (filters.flowKey) {
      whereConditions.push(`flow_key = $${paramIndex}`)
      queryParams.push(filters.flowKey)
      paramIndex++
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // Count total records
    const countQuery = `SELECT COUNT(*) FROM ${this.tableName} ${whereClause}`
    const countResult = await this.database.query(countQuery, queryParams)
    const total = parseInt(countResult.rows[0].count)

    // Get paginated records
    const dataQuery = `
      SELECT * FROM ${this.tableName} 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    queryParams.push(limit, offset)

    const dataResult = await this.database.query(dataQuery, queryParams)
    const jobs = dataResult.rows.map(row => this.mapToResponseDto(row))

    return { jobs, total }
  }

  async update(key: string, updates: UpdateJobDto, userId: number): Promise<JobResponseDto | null> {
    const setClauses: string[] = []
    const queryParams: any[] = []
    let paramIndex = 1

    // Build SET clauses for updated fields
    Object.entries(updates).forEach(([field, value]) => {
      if (value !== undefined) {
        switch (field) {
          case 'name':
          case 'workerKey':
          case 'flowKey':
          case 'description':
          case 'status':
          case 'progress':
          case 'duration':
          case 'startedAt':
          case 'completedAt':
          case 'error':
            const dbField = this.camelToSnake(field)
            setClauses.push(`${dbField} = $${paramIndex}`)
            queryParams.push(value)
            paramIndex++
            break
          case 'parameters':
          case 'result':
            const dbJsonField = this.camelToSnake(field)
            setClauses.push(`${dbJsonField} = $${paramIndex}`)
            queryParams.push(JSON.stringify(value))
            paramIndex++
            break
        }
      }
    })

    if (setClauses.length === 0) {
      return this.findByKey(key)
    }

    // Always update the updated_by and updated_at fields
    setClauses.push(`updated_by = $${paramIndex}`, `updated_at = $${paramIndex + 1}`)
    queryParams.push(userId, new Date())
    paramIndex += 2

    const query = `
      UPDATE ${this.tableName} 
      SET ${setClauses.join(', ')}
      WHERE key = $${paramIndex}
      RETURNING *;
    `
    queryParams.push(key)

    try {
      const result = await this.database.query(query, queryParams)
      return this.mapToResponseDto(result.rows[0])
    } catch (error) {
      return null
    }
  }

  async delete(key: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE key = $1`
    const result = await this.database.query(query, [key])
    return result.rowCount !== null && result.rowCount > 0
  }

  async getStats(): Promise<JobStatsResponseDto> {
    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'running') as running,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) as total,
        AVG(duration) FILTER (WHERE duration IS NOT NULL) as average_duration
      FROM ${this.tableName}
    `

    const result = await this.database.query(query)
    const row = result.rows[0]

    return {
      completed: parseInt(row.completed) || 0,
      running: parseInt(row.running) || 0,
      failed: parseInt(row.failed) || 0,
      pending: parseInt(row.pending) || 0,
      total: parseInt(row.total) || 0,
      averageDuration: row.average_duration ? parseFloat(row.average_duration) : null,
    }
  }

  private mapToResponseDto(row: JobDatabaseDto): JobResponseDto {
    return {
      id: row.id,
      key: row.key,
      name: row.name,
      workerKey: row.worker_key,
      flowKey: row.flow_key,
      description: row.description,
      status: row.status,
      parameters: row.parameters || {},
      result: row.result,
      progress: row.progress,
      duration: row.duration,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      error: row.error,
      createdBy: row.created_by,
      updatedBy: row.updated_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
  }
}