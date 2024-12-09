import { Automation } from './automationModel'
import { readSqlFile } from '@/common/utils/sqlReader'
import { logger } from '@/server'
import { getDbConnection, endDbConnection } from '@/common/utils/dbPool'

export class AutomationRepository {
  async createAutomation(automation: Automation): Promise<Automation> {
    const sql = readSqlFile('db/insert_automation.sql')
    // prettier-ignore
    const values = [
      automation.name,
      automation.description,
      automation.createdBy,
      automation.updatedBy
    ]
    const db = await getDbConnection()
    try {
      const result = await db.query(sql, values)
      const rows = result.rows[0]
      return {
        id: rows.id,
        key: rows.automation_key,
        name: rows.automation_name,
        description: rows.automation_description,
        createdBy: rows.created_by,
        updatedBy: rows.updated_by,
        createdAt: rows.created_at,
        updatedAt: rows.updated_at,
      }
    } catch (err) {
      logger.error(`Error creating automation: ${err}`)
      throw new Error(`Error creating automation: ${err}`)
    } finally {
      db.release()
      endDbConnection()
    }
  }
}
