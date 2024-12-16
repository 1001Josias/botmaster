import { DatabaseError } from 'pg'
import { logger } from '@/server'
import { IAutomation } from '@/api/automations/automation'
import { PostgresError } from '@/common/utils/errorHandlers'
import { readSqlFile } from '@/common/utils/sqlReader'
import { dbPool } from '@/common/utils/dbPool'

export class AutomationRepository {
  async createAutomation(automation: IAutomation): Promise<IAutomation> {
    // prettier-ignore
    const values = [
      automation.name,
      automation.description,
      automation.createdBy,
      automation.updatedBy
    ]
    const querySql = readSqlFile(`${__dirname}/db/insert_automation.sql`)
    try {
      const { rows } = await dbPool.query(querySql, values)
      const row = rows[0]
      logger.info(`Automation ${row.id} created!`)
      return {
        id: row.id,
        key: row.key,
        name: row.name,
        description: row.description,
        createdBy: row.created_by,
        updatedBy: row.updated_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    } catch (err) {
      if (err instanceof DatabaseError) {
        throw PostgresError.toBusinessError(err)
      }
      throw err
    }
  }
}
