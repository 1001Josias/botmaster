import { PoolClient } from 'pg'
import { BaseRepository } from '@/common/repositories/baseRepository'
import { readSqlFile } from '@/common/utils/sqlReader'
import { Folder, FolderDatabaseDto, CreateFolderDto } from './folderModel'

const getAllFoldersQuery = readSqlFile(`${__dirname}/db/queries/get_all_folders.sql`)
const getFolderByIdQuery = readSqlFile(`${__dirname}/db/queries/get_folder_by_id.sql`)
const createFolderQuery = readSqlFile(`${__dirname}/db/queries/create_folder.sql`)
const updateFolderQuery = readSqlFile(`${__dirname}/db/queries/update_folder.sql`)
const deleteFolderQuery = readSqlFile(`${__dirname}/db/queries/delete_folder.sql`)

export class FolderRepository extends BaseRepository {
  constructor(database: PoolClient) {
    super(database)
  }

  async findAll(): Promise<FolderDatabaseDto[]> {
    const result = await this.database.query<FolderDatabaseDto>(getAllFoldersQuery)
    return result.rows
  }

  async findById(id: number): Promise<FolderDatabaseDto> {
    const result = await this.query<FolderDatabaseDto>(getFolderByIdQuery, [id])
    return result.rows[0]
  }

  async create(folder: CreateFolderDto, userId: number): Promise<FolderDatabaseDto> {
    // Generate path if not provided
    const path = folder.path || `/${folder.name}`
    
    const result = await this.query<FolderDatabaseDto>(createFolderQuery, [
      folder.name,
      folder.tenantKey,
      folder.description || '',
      userId,
      folder.parentFolderKey || null,
      path,
      folder.enabled || true,
      JSON.stringify(folder.settings || {}),
    ])
    return result.rows[0]
  }

  async update(id: number, folder: Partial<CreateFolderDto>, userId: number): Promise<FolderDatabaseDto> {
    const result = await this.query<FolderDatabaseDto>(updateFolderQuery, [
      id,
      folder.name,
      folder.tenantKey,
      folder.description,
      folder.parentFolderKey,
      folder.path,
      folder.enabled,
      folder.settings ? JSON.stringify(folder.settings) : null,
      userId,
    ])
    return result.rows[0]
  }

  async delete(id: number): Promise<void> {
    await this.query(deleteFolderQuery, [id])
  }
}