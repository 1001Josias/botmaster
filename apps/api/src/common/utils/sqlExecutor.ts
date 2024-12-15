import { readSqlFile } from '@/common/utils/sqlReader'
import { dbPool } from '@/common/utils/dbPool'

export async function executeSqlFile(filePath: string, params: any[] = []) {
  const sql = readSqlFile(filePath)
  try {
    return await dbPool.query(sql, params)
  } catch (err) {
    throw new Error(`Error executing query ${sql}: ${err}`)
  }
}
