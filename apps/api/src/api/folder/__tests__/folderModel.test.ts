import { describe, it, expect } from 'vitest'
import { FolderSchema, CreateFolderSchema } from '../folderModel'

describe('Folder Model', () => {
  it('should validate folder schema', () => {
    const validFolder = {
      id: 1,
      key: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Test Folder',
      tenantKey: '550e8400-e29b-41d4-a716-446655440000', 
      description: 'A test folder',
      createdBy: 1,
      updatedBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      path: '/test-folder',
      enabled: true,
      settings: {},
    }

    const result = FolderSchema.safeParse(validFolder)
    expect(result.success).toBe(true)
  })

  it('should validate create folder schema', () => {
    const validCreateFolder = {
      name: 'New Folder',
      tenantKey: '550e8400-e29b-41d4-a716-446655440000',
      description: 'A new folder',
      path: '/new-folder',
      enabled: true,
      settings: { color: 'blue' },
    }

    const result = CreateFolderSchema.shape.body.safeParse(validCreateFolder)
    expect(result.success).toBe(true)
  })

  it('should require tenantKey', () => {
    const invalidCreateFolder = {
      name: 'New Folder',
      // Missing tenantKey
      description: 'A new folder',
    }

    const result = CreateFolderSchema.shape.body.safeParse(invalidCreateFolder)
    expect(result.success).toBe(false)
  })
})