import { DatabaseError } from 'pg'
import { logger } from '@/server'
import { IAutomation } from '@/api/automations/automation'
import { PostgresError } from '@/common/utils/errorHandlers'

export class AutomationRepository {
  async createAutomation(automation: IAutomation): Promise<IAutomation> {
    // prettier-ignore
    const values = [
      automation.name,
      automation.description,
      automation.createdBy,
      automation.updatedBy
    ]
    try {
      const { rows } = await executeSqlFile(`${__dirname}/db/insert_automation.sql`, values)
      const row = rows[0]
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
        logger.error(err)
        throw PostgresError.toBusinessError(err)
      }
      throw err
    }
  }
}
