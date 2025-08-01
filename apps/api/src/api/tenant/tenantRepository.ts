import { PoolClient } from 'pg'
import { BaseRepository } from '@/common/repositories/baseRepository'
import { readSqlFile } from '@/common/utils/sqlReader'
import { Tenant, TenantDatabaseDto, CreateTenantDto } from './tenantModel'

const getAllTenantsQuery = readSqlFile(`${__dirname}/db/queries/get_all_tenants.sql`)
const getTenantByIdQuery = readSqlFile(`${__dirname}/db/queries/get_tenant_by_id.sql`)
const createTenantQuery = readSqlFile(`${__dirname}/db/queries/create_tenant.sql`)
const updateTenantQuery = readSqlFile(`${__dirname}/db/queries/update_tenant.sql`)
const deleteTenantQuery = readSqlFile(`${__dirname}/db/queries/delete_tenant.sql`)

export class TenantRepository extends BaseRepository {
  constructor(database: PoolClient) {
    super(database)
  }

  async findAll(): Promise<TenantDatabaseDto[]> {
    const result = await this.database.query<TenantDatabaseDto>(getAllTenantsQuery)
    return result.rows
  }

  async findById(id: number): Promise<TenantDatabaseDto> {
    const result = await this.query<TenantDatabaseDto>(getTenantByIdQuery, [id])
    return result.rows[0]
  }

  async create(tenant: CreateTenantDto, userId: number): Promise<TenantDatabaseDto> {
    const result = await this.query<TenantDatabaseDto>(createTenantQuery, [
      tenant.name,
      tenant.subdomain || null,
      tenant.description || '',
      userId,
      tenant.enabled || true,
      JSON.stringify(tenant.settings || {}),
    ])
    return result.rows[0]
  }

  async update(id: number, tenant: Partial<CreateTenantDto>, userId: number): Promise<TenantDatabaseDto> {
    const result = await this.query<TenantDatabaseDto>(updateTenantQuery, [
      id,
      tenant.name,
      tenant.subdomain,
      tenant.description,
      tenant.enabled,
      tenant.settings ? JSON.stringify(tenant.settings) : null,
      userId,
    ])
    return result.rows[0]
  }

  async delete(id: number): Promise<void> {
    await this.query(deleteTenantQuery, [id])
  }

  private mapDatabaseToTenant(dbTenant: TenantDatabaseDto): Tenant {
    return {
      id: dbTenant.id,
      key: dbTenant.key,
      name: dbTenant.name,
      subdomain: dbTenant.subdomain,
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