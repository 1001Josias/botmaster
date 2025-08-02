import { describe, expect, it } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { app } from '@/server'

describe('Worker API Endpoints', () => {
  const folderKey = 'a5b3c1d2-e4f6-7890-abcd-ef1234567890'

  describe('GET /workers', () => {
    it('should return paginated workers list with default pagination', async () => {
      const response = await request(app).get('/api/v1/workers').set('x-folder-key', folderKey).query({}) // No pagination params, should use defaults

      expect(response.statusCode).toEqual(StatusCodes.OK)
      expect(response.body.success).toBeTruthy()
      expect(response.body.responseObject).toHaveProperty('items')
      expect(response.body.responseObject).toHaveProperty('pagination')
      expect(response.body.responseObject.pagination).toHaveProperty('page', 1)
      expect(response.body.responseObject.pagination).toHaveProperty('limit', 10)
      expect(response.body.responseObject.pagination).toHaveProperty('totalPages')
      expect(response.body.responseObject.pagination).toHaveProperty('totalItems')
      expect(response.body.responseObject.pagination).toHaveProperty('previousPages')
      expect(response.body.responseObject.pagination).toHaveProperty('nextPages')
      expect(response.body.responseObject.pagination).toHaveProperty('firstPage', 1)
      expect(response.body.responseObject.pagination).toHaveProperty('lastPage')
    })

    it('should return paginated workers list with specific pagination params', async () => {
      const response = await request(app)
        .get('/api/v1/workers')
        .set('x-folder-key', folderKey)
        .query({ page: 2, limit: 5 })

      expect(response.statusCode).toEqual(StatusCodes.OK)
      expect(response.body.success).toBeTruthy()
      expect(response.body.responseObject.pagination.page).toBe(2)
      expect(response.body.responseObject.pagination.limit).toBe(5)
    })

    it('should respect maximum limit of 100', async () => {
      const response = await request(app)
        .get('/api/v1/workers')
        .set('x-folder-key', folderKey)
        .query({ page: 1, limit: 200 }) // Above max limit

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    })

    it('should reject invalid page numbers', async () => {
      const response = await request(app)
        .get('/api/v1/workers')
        .set('x-folder-key', folderKey)
        .query({ page: 0, limit: 10 })

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    })

    it('should reject invalid limit values', async () => {
      const response = await request(app)
        .get('/api/v1/workers')
        .set('x-folder-key', folderKey)
        .query({ page: 1, limit: 0 })

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    })

    it('should return empty list with proper pagination when no workers exist', async () => {
      const response = await request(app).get('/api/v1/workers').set('x-folder-key', 'non-existent-folder-key')

      expect(response.statusCode).toEqual(StatusCodes.OK)
      expect(response.body.responseObject.items).toEqual([])
      expect(response.body.responseObject.pagination.totalItems).toBe(0)
      expect(response.body.responseObject.pagination.totalPages).toBe(0)
      expect(response.body.responseObject.pagination.lastPage).toBe(1) // Always at least 1
      expect(response.body.responseObject.pagination.previousPages).toEqual([])
      expect(response.body.responseObject.pagination.nextPages).toEqual([])
    })

    it('should require folder key header', async () => {
      const response = await request(app).get('/api/v1/workers')

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    })
  })

  describe('GET /workers/:key', () => {
    it('should return 404 for non-existent worker key', async () => {
      const nonExistentKey = 'a5b3c1d2-e4f6-7890-abcd-ef1234567890'

      const response = await request(app).get(`/api/v1/workers/${nonExistentKey}`).set('x-folder-key', folderKey)

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND)
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toContain('Worker not found')
      expect(response.body.responseObject).toBeNull()
    })
  })
})
