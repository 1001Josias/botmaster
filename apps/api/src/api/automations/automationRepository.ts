import { Automation } from './automationModel'
import { readSqlFile } from '@/common/utils/sqlReader'
import { logger } from '@/server'
import { getDbConnection, endDbConnection } from '@/common/utils/dbPool'

export class AutomationRepository {
  async createAutomation(automation: Automation) {
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
      await db.query(sql, values)
    } catch (err) {
      logger.error(`Error creating automation: ${err}`)
      throw new Error(`Error creating automation: ${err}`)
    } finally {
      db.release()
      endDbConnection()
    }
  }
}
