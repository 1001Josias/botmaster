import fs from 'fs'
import path from 'path'
import { logger } from '@/server'

export function readSqlFile(filePath: string): string {
  const resolvedPath = path.resolve(__dirname, filePath)
  try {
    return fs.readFileSync(resolvedPath, 'utf-8')
  } catch (err) {
    const errorMessage = `Error reading SQL file: ${err}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }
}
