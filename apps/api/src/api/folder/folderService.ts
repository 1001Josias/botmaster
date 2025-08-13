import { ServiceResponse } from '@/common/models/serviceResponse'
import { BaseService } from '@/common/services/baseService'
import { ServiceResponseObjectError } from '@/common/services/services'
import { FolderRepository } from './folderRepository'
import { Folder, CreateFolderDto, FolderDatabaseDto } from './folderModel'

export class FolderService extends BaseService {
  constructor() {
    super()
  }

  async findAll(): Promise<ServiceResponse<Folder[] | ServiceResponseObjectError | null>> {
    try {
      const folders = await FolderRepository.session(this.context, async (repository) => {
        const dbFolders = await repository.findAll()
        return dbFolders.map(this.mapDatabaseToFolder)
      })
      return this.fetchedSuccessfully('Folders retrieved successfully', folders)
    } catch (error) {
      return this.handleError(
        error,
        {},
        {
          message: 'Failed to retrieve folders',
          responseObject: { error: 'FOLDERS_RETRIEVAL_FAILED' },
        }
      )
    }
  }

  async findById(id: number): Promise<ServiceResponse<Folder | ServiceResponseObjectError | null>> {
    try {
      const folder = await FolderRepository.session(this.context, async (repository) => {
        const dbFolder = await repository.findById(id)
        return this.mapDatabaseToFolder(dbFolder)
      })
      return this.fetchedSuccessfully('Folder retrieved successfully', folder)
    } catch (error) {
      return this.handleError(
        error,
        {},
        {
          message: 'Folder not found',
          responseObject: { error: 'FOLDER_NOT_FOUND' },
        }
      )
    }
  }

  async create(folderData: CreateFolderDto): Promise<ServiceResponse<Folder | ServiceResponseObjectError | null>> {
    try {
      const folder = await FolderRepository.session(this.context, async (repository) => {
        const dbFolder = await repository.create(folderData, 1) // TODO: Get actual user ID from context
        return this.mapDatabaseToFolder(dbFolder)
      })
      return this.createdSuccessfully('Folder created successfully', folder)
    } catch (error) {
      return this.handleError(
        error,
        {
          folder_name_tenant_key: {
            message: 'A folder with this name already exists in the tenant',
            responseObject: { error: 'FOLDER_NAME_EXISTS' },
          },
        },
        {
          message: 'Failed to create folder',
          responseObject: { error: 'FOLDER_CREATION_FAILED' },
        }
      )
    }
  }

  async update(id: number, folderData: Partial<CreateFolderDto>): Promise<ServiceResponse<Folder | ServiceResponseObjectError | null>> {
    try {
      const folder = await FolderRepository.session(this.context, async (repository) => {
        const dbFolder = await repository.update(id, folderData, 1) // TODO: Get actual user ID from context
        return this.mapDatabaseToFolder(dbFolder)
      })
      return this.updatedSuccessfully('Folder updated successfully', folder)
    } catch (error) {
      return this.handleError(
        error,
        {
          folder_name_tenant_key: {
            message: 'A folder with this name already exists in the tenant',
            responseObject: { error: 'FOLDER_NAME_EXISTS' },
          },
        },
        {
          message: 'Folder not found',
          responseObject: { error: 'FOLDER_NOT_FOUND' },
        }
      )
    }
  }

  async delete(id: number): Promise<ServiceResponse<ServiceResponseObjectError | null>> {
    try {
      await FolderRepository.session(this.context, async (repository) => {
        await repository.delete(id)
      })
      return this.deletedSuccessfully('Folder deleted successfully', null)
    } catch (error) {
      return this.handleError(
        error,
        {},
        {
          message: 'Folder not found',
          responseObject: { error: 'FOLDER_NOT_FOUND' },
        }
      )
    }
  }

  private mapDatabaseToFolder(dbFolder: FolderDatabaseDto): Folder {
    return {
      id: dbFolder.id,
      key: dbFolder.key,
      name: dbFolder.name,
      tenantKey: dbFolder.tenant_key,
      description: dbFolder.description,
      createdBy: dbFolder.created_by,
      updatedBy: dbFolder.updated_by,
      createdAt: dbFolder.created_at,
      updatedAt: dbFolder.updated_at,
      parentFolderKey: dbFolder.parent_folder_key || undefined,
      path: dbFolder.path,
      enabled: dbFolder.enabled,
      settings: dbFolder.settings,
    }
  }
}