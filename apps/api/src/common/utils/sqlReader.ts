import fs from 'fs'

/**
 * Read SQL file from the file system
 * @param {string} filePath - Path to the SQL file
 * @example
 * readSqlFile('path/to/file.sql')
 * @returns {string} - SQL file content
 */

export function readSqlFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch (err) {
    throw new SqlFileReaderError(err as Error)
  }
}

class SqlFileReaderError extends Error {
  constructor(error: Error) {
    const message = `Error reading SQL file: ${error.message}`
    super(message)
    this.name = 'SqlFileReaderError'
    this.cause = error.cause
  }
}
