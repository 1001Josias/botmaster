import { ServiceResponse } from '@/common/models/serviceResponse'
import { BaseService } from '@/common/services/baseService'
import { ServiceResponseObjectError } from '@/common/services/services'
import { TenantRepository } from './tenantRepository'
import { Tenant, CreateTenantDto, TenantDatabaseDto } from './tenantModel'

export class TenantService extends BaseService {
  constructor() {
    super()
  }

  async findAll(): Promise<ServiceResponse<Tenant[] | ServiceResponseObjectError | null>> {
    try {
      const tenants = await TenantRepository.session(this.context, async (repository) => {
        const dbTenants = await repository.findAll()
        return dbTenants.map(this.mapDatabaseToTenant)
      })
      return this.fetchedSuccessfully('Tenants retrieved successfully', tenants)
    } catch (error) {
      return this.handleError(
        error,
        {},
        {
          message: 'Failed to retrieve tenants',
          responseObject: { error: 'TENANTS_RETRIEVAL_FAILED' },
        }
      )
    }
  }

  async findById(id: number): Promise<ServiceResponse<Tenant | ServiceResponseObjectError | null>> {
    try {
      const tenant = await TenantRepository.session(this.context, async (repository) => {
        const dbTenant = await repository.findById(id)
        return this.mapDatabaseToTenant(dbTenant)
      })
      return this.fetchedSuccessfully('Tenant retrieved successfully', tenant)
    } catch (error) {
      return this.handleError(
        error,
        {},
        {
          message: 'Tenant not found',
          responseObject: { error: 'TENANT_NOT_FOUND' },
        }
      )
    }
  }

  async create(tenantData: CreateTenantDto): Promise<ServiceResponse<Tenant | ServiceResponseObjectError | null>> {
    try {
      const tenant = await TenantRepository.session(this.context, async (repository) => {
        const dbTenant = await repository.create(tenantData, 1) // TODO: Get actual user ID from context
        return this.mapDatabaseToTenant(dbTenant)
      })
      return this.createdSuccessfully('Tenant created successfully', tenant)
    } catch (error) {
      return this.handleError(
        error,
        {
          tenant_subdomain_key: {
            message: 'A tenant with this subdomain already exists',
            responseObject: { error: 'TENANT_SUBDOMAIN_EXISTS' },
          },
        },
        {
          message: 'Failed to create tenant',
          responseObject: { error: 'TENANT_CREATION_FAILED' },
        }
      )
    }
  }

  async update(id: number, tenantData: Partial<CreateTenantDto>): Promise<ServiceResponse<Tenant | ServiceResponseObjectError | null>> {
    try {
      const tenant = await TenantRepository.session(this.context, async (repository) => {
        const dbTenant = await repository.update(id, tenantData, 1) // TODO: Get actual user ID from context
        return this.mapDatabaseToTenant(dbTenant)
      })
      return this.updatedSuccessfully('Tenant updated successfully', tenant)
    } catch (error) {
      return this.handleError(
        error,
        {
          tenant_subdomain_key: {
            message: 'A tenant with this subdomain already exists',
            responseObject: { error: 'TENANT_SUBDOMAIN_EXISTS' },
          },
        },
        {
          message: 'Tenant not found',
          responseObject: { error: 'TENANT_NOT_FOUND' },
        }
      )
    }
  }

  async delete(id: number): Promise<ServiceResponse<ServiceResponseObjectError | null>> {
    try {
      await TenantRepository.session(this.context, async (repository) => {
        await repository.delete(id)
      })
      return this.deletedSuccessfully('Tenant deleted successfully', null)
    } catch (error) {
      return this.handleError(
        error,
        {},
        {
          message: 'Tenant not found',
          responseObject: { error: 'TENANT_NOT_FOUND' },
        }
      )
    }
  }

  private mapDatabaseToTenant(dbTenant: TenantDatabaseDto): Tenant {
    return {
      id: dbTenant.id,
      key: dbTenant.key,
      name: dbTenant.name,
      subdomain: dbTenant.subdomain || undefined,
      description: dbTenant.description,
      createdBy: dbTenant.created_by,
      updatedBy: dbTenant.updated_by,
      createdAt: dbTenant.created_at,
      updatedAt: dbTenant.updated_at,
      enabled: dbTenant.enabled,
      settings: dbTenant.settings,
    }
  }
}