import { describe, expect, it } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { app } from '@/server'

describe('Worker API Endpoints', () => {
  describe('GET /workers/:key', () => {
    it('should return 404 for non-existent worker key', async () => {
      const nonExistentKey = 'a5b3c1d2-e4f6-7890-abcd-ef1234567890'
      
      const response = await request(app)
        .get(`/api/v1/workers/${nonExistentKey}`)
        .set('x-folder-key', 'a5b3c1d2-e4f6-7890-abcd-ef1234567890')
      
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND)
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toContain('Worker not found')
      expect(response.body.responseObject).toBeNull()
    })
  })
})