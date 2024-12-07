import { readSqlFile } from '@/common/utils/sqlReader'
import { getDbConnection, endDbConnection } from '@/common/utils/dbPool'
import { logger } from '@/server'

export async function executeSqlFile(filePath: string, params: any[] = []) {
  const sql = readSqlFile(filePath)
  const db = await getDbConnection()
  try {
    await db.query(sql, params)
  } catch (err) {
    logger.error(`Error executing SQL file: ${err}`)
    throw new Error(`Error executing SQL file: ${err}`)
  } finally {
    db.release()
    endDbConnection()
  }
}
