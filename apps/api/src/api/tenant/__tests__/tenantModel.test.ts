import { describe, it, expect } from 'vitest'
import { TenantSchema, CreateTenantSchema } from '../tenantModel'

describe('Tenant Model', () => {
  it('should validate tenant schema', () => {
    const validTenant = {
      id: 1,
      key: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Test Tenant',
      subdomain: 'test-tenant',
      description: 'A test tenant',
      createdBy: 1,
      updatedBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      enabled: true,
      settings: {},
    }

    const result = TenantSchema.safeParse(validTenant)
    expect(result.success).toBe(true)
  })

  it('should validate create tenant schema', () => {
    const validCreateTenant = {
      name: 'New Tenant',
      subdomain: 'new-tenant',
      description: 'A new tenant',
      enabled: true,
      settings: { theme: 'dark' },
    }

    const result = CreateTenantSchema.shape.body.safeParse(validCreateTenant)
    expect(result.success).toBe(true)
  })

  it('should reject invalid subdomain', () => {
    const invalidCreateTenant = {
      name: 'New Tenant',
      subdomain: 'Invalid Subdomain!', // Invalid characters
      description: 'A new tenant',
    }

    const result = CreateTenantSchema.shape.body.safeParse(invalidCreateTenant)
    expect(result.success).toBe(false)
  })
})