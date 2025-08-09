import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/server'
import type { GitHubCommentWebhook } from '../githubWebhookModel'

describe('GitHub Webhook API', () => {
  beforeAll(async () => {
    // Setup test environment if needed
  })

  afterAll(async () => {
    // Cleanup test environment if needed
  })

  describe('POST /api/v1/github-webhooks/webhook', () => {
    it('should process GitHub issue comment webhook successfully', async () => {
      const mockWebhookPayload: GitHubCommentWebhook = {
        action: 'created',
        issue: {
          id: 12345,
          number: 1,
          title: 'Test Issue',
          body: 'This is a test issue',
          html_url: 'https://github.com/test/repo/issues/1',
          state: 'open',
          user: {
            login: 'testuser',
            id: 67890,
            avatar_url: 'https://github.com/testuser.png',
            html_url: 'https://github.com/testuser',
          },
        },
        comment: {
          id: 98765,
          body: 'Hello @botmaster, can you help with this?',
          html_url: 'https://github.com/test/repo/issues/1#issuecomment-98765',
          user: {
            login: 'commenter',
            id: 54321,
            avatar_url: 'https://github.com/commenter.png',
            html_url: 'https://github.com/commenter',
          },
          created_at: '2023-08-01T12:00:00Z',
          updated_at: '2023-08-01T12:00:00Z',
        },
        repository: {
          id: 11111,
          name: 'repo',
          full_name: 'test/repo',
          html_url: 'https://github.com/test/repo',
          owner: {
            login: 'test',
            id: 22222,
            avatar_url: 'https://github.com/test.png',
            html_url: 'https://github.com/test',
          },
        },
      }

      const response = await request(app)
        .post('/api/v1/github-webhooks/webhook')
        .set('x-github-event', 'issue_comment')
        .send(mockWebhookPayload)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.responseObject.bot_mentioned).toBe(true)
    })

    it('should ignore non-comment events', async () => {
      const response = await request(app)
        .post('/api/v1/github-webhooks/webhook')
        .set('x-github-event', 'push')
        .send({ test: 'data' })

      expect(response.status).toBe(200)
      expect(response.body.message).toContain('Event type not handled')
    })

    it('should detect bot mentions correctly', async () => {
      const mockWebhookPayload: GitHubCommentWebhook = {
        action: 'created',
        issue: {
          id: 12345,
          number: 1,
          title: 'Test Issue',
          body: 'This is a test issue',
          html_url: 'https://github.com/test/repo/issues/1',
          state: 'open',
          user: {
            login: 'testuser',
            id: 67890,
            avatar_url: 'https://github.com/testuser.png',
            html_url: 'https://github.com/testuser',
          },
        },
        comment: {
          id: 98765,
          body: 'This comment does not mention the bot',
          html_url: 'https://github.com/test/repo/issues/1#issuecomment-98765',
          user: {
            login: 'commenter',
            id: 54321,
            avatar_url: 'https://github.com/commenter.png',
            html_url: 'https://github.com/commenter',
          },
          created_at: '2023-08-01T12:00:00Z',
          updated_at: '2023-08-01T12:00:00Z',
        },
        repository: {
          id: 11111,
          name: 'repo',
          full_name: 'test/repo',
          html_url: 'https://github.com/test/repo',
          owner: {
            login: 'test',
            id: 22222,
            avatar_url: 'https://github.com/test.png',
            html_url: 'https://github.com/test',
          },
        },
      }

      const response = await request(app)
        .post('/api/v1/github-webhooks/webhook')
        .set('x-github-event', 'issue_comment')
        .send(mockWebhookPayload)

      expect(response.status).toBe(200)
      expect(response.body.responseObject.bot_mentioned).toBe(false)
    })
  })

  describe('Bot Response Config API', () => {
    it('should create a bot response configuration', async () => {
      const configData = {
        repository_pattern: 'test/*',
        mention_keywords: ['help', 'assist'],
        response_template: 'Hello {user}! I can help you with {issue_title}.',
        enabled: true,
        priority: 7,
      }

      const response = await request(app)
        .post('/api/v1/github-webhooks/configs')
        .send(configData)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.responseObject.repository_pattern).toBe('test/*')
    })

    it('should list bot response configurations', async () => {
      const response = await request(app).get('/api/v1/github-webhooks/configs')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.responseObject)).toBe(true)
    })
  })

  describe('Webhook Events API', () => {
    it('should list webhook events with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/github-webhooks/events')
        .query({ limit: 10, offset: 0 })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.responseObject).toHaveProperty('events')
      expect(response.body.responseObject).toHaveProperty('total')
    })
  })
})