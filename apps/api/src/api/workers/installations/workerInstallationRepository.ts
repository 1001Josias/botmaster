import { Pool, PoolClient } from 'pg'
import {
  WorkerInstallationDto,
  WorkerInstallationDatabaseResponseDto,
  WorkerInstallationResponseDto,
} from '@/api/workers/installations/workerInstallationModel'
import { dbPool } from '@/common/utils/dbPool'
import { BaseRepository } from '@/common/repositories/baseRepository'
import { readSqlFile } from '@/common/utils/sqlReader'
import { IWorkerInstallation } from './workerInstalation'

const installWorkerSql = readSqlFile(`${__dirname}/db/queries/install_worker.sql`)

export class WorkerInstallationRepository
  extends BaseRepository
  implements IWorkerInstallation<[WorkerInstallationDto], Promise<WorkerInstallationResponseDto | void>>
{
  constructor(protected readonly database: PoolClient | Pool = dbPool) {
    super(database)
  }

  async install(worker: WorkerInstallationDto): Promise<WorkerInstallationResponseDto> {
    const values = [
      worker.workerKey,
      worker.priority,
      worker.folderKey,
      worker.defaultVersion,
      worker.installedBy,
      worker.defaultProperties,
    ]
    const result = await this.query<WorkerInstallationDatabaseResponseDto>(installWorkerSql, values)
    const row = result.rows[0]
    return {
      workerKey: row.worker_key,
      priority: row.priority,
      folderKey: row.folder_key,
      defaultVersion: row.default_version,
      installedBy: row.installed_by,
      defaultProperties: row.default_properties,
      installedAt: row.installed_at,
    }
  }
}
