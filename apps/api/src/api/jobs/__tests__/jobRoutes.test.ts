import { describe, expect, it } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { app } from '@/server'

describe('Job API Endpoints', () => {
  describe('GET /jobs', () => {
    it('should return empty list when no jobs exist', async () => {
      const response = await request(app)
        .get('/api/v1/jobs')

      expect(response.statusCode).toEqual(StatusCodes.OK)
      expect(response.body.success).toBeTruthy()
      expect(response.body.responseObject).toHaveProperty('jobs')
      expect(response.body.responseObject).toHaveProperty('total')
      expect(response.body.responseObject).toHaveProperty('page')
      expect(response.body.responseObject).toHaveProperty('limit')
    })

    it('should accept pagination parameters', async () => {
      const response = await request(app)
        .get('/api/v1/jobs?page=2&limit=10')

      expect(response.statusCode).toEqual(StatusCodes.OK)
      expect(response.body.responseObject.page).toBe(2)
      expect(response.body.responseObject.limit).toBe(10)
    })

    it('should accept filter parameters', async () => {
      const response = await request(app)
        .get('/api/v1/jobs?status=completed&workerKey=test-worker')

      expect(response.statusCode).toEqual(StatusCodes.OK)
    })
  })

  describe('GET /jobs/stats', () => {
    it('should return job statistics', async () => {
      const response = await request(app)
        .get('/api/v1/jobs/stats')

      expect(response.statusCode).toEqual(StatusCodes.OK)
      expect(response.body.success).toBeTruthy()
      expect(response.body.responseObject).toHaveProperty('completed')
      expect(response.body.responseObject).toHaveProperty('running')
      expect(response.body.responseObject).toHaveProperty('failed')
      expect(response.body.responseObject).toHaveProperty('pending')
      expect(response.body.responseObject).toHaveProperty('total')
      expect(response.body.responseObject).toHaveProperty('averageDuration')
    })
  })

  describe('GET /jobs/:key', () => {
    it('should return 404 for non-existent job key', async () => {
      const nonExistentKey = 'a5b3c1d2-e4f6-7890-abcd-ef1234567890'

      const response = await request(app)
        .get(`/api/v1/jobs/${nonExistentKey}`)

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND)
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toContain('Job not found')
      expect(response.body.responseObject).toBeNull()
    })
  })

  describe('POST /jobs', () => {
    it('should create a new job with valid data', async () => {
      const newJob = {
        name: 'Test Job',
        workerKey: 'test-worker',
        description: 'A test job',
        parameters: { test: 'value' }
      }

      const response = await request(app)
        .post('/api/v1/jobs')
        .send(newJob)

      expect(response.statusCode).toEqual(StatusCodes.CREATED)
      expect(response.body.success).toBeTruthy()
      expect(response.body.responseObject).toHaveProperty('key')
      expect(response.body.responseObject.name).toBe(newJob.name)
      expect(response.body.responseObject.workerKey).toBe(newJob.workerKey)
      expect(response.body.responseObject.status).toBe('pending')
    })

    it('should return 400 for invalid job data', async () => {
      const invalidJob = {
        // Missing required fields
        description: 'Invalid job'
      }

      const response = await request(app)
        .post('/api/v1/jobs')
        .send(invalidJob)

      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST)
      expect(response.body.success).toBeFalsy()
    })
  })

  describe('PUT /jobs/:key', () => {
    it('should return 404 for non-existent job key', async () => {
      const nonExistentKey = 'a5b3c1d2-e4f6-7890-abcd-ef1234567890'
      const updates = { status: 'running' }

      const response = await request(app)
        .put(`/api/v1/jobs/${nonExistentKey}`)
        .send(updates)

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND)
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toContain('Job not found')
    })
  })

  describe('DELETE /jobs/:key', () => {
    it('should return 404 for non-existent job key', async () => {
      const nonExistentKey = 'a5b3c1d2-e4f6-7890-abcd-ef1234567890'

      const response = await request(app)
        .delete(`/api/v1/jobs/${nonExistentKey}`)

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND)
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toContain('Job not found')
    })
  })

  describe('POST /jobs/:key/start', () => {
    it('should return 404 for non-existent job key', async () => {
      const nonExistentKey = 'a5b3c1d2-e4f6-7890-abcd-ef1234567890'

      const response = await request(app)
        .post(`/api/v1/jobs/${nonExistentKey}/start`)

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND)
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toContain('Job not found')
    })
  })

  describe('POST /jobs/:key/complete', () => {
    it('should return 404 for non-existent job key', async () => {
      const nonExistentKey = 'a5b3c1d2-e4f6-7890-abcd-ef1234567890'
      const result = { success: true }

      const response = await request(app)
        .post(`/api/v1/jobs/${nonExistentKey}/complete`)
        .send({ result })

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND)
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toContain('Job not found')
    })
  })

  describe('POST /jobs/:key/fail', () => {
    it('should return 404 for non-existent job key', async () => {
      const nonExistentKey = 'a5b3c1d2-e4f6-7890-abcd-ef1234567890'
      const error = 'Test error message'

      const response = await request(app)
        .post(`/api/v1/jobs/${nonExistentKey}/fail`)
        .send({ error })

      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND)
      expect(response.body.success).toBeFalsy()
      expect(response.body.message).toContain('Job not found')
    })
  })
})