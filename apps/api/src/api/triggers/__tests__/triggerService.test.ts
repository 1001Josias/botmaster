import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { MockedFunction } from 'vitest'
import { StatusCodes } from 'http-status-codes'

import { TriggerService } from '../triggerService'
import { TriggerRepository } from '../triggerRepository'
import type { CreateTrigger } from '../triggerModel'

// Mock the TriggerRepository
vi.mock('../triggerRepository')

const mockTriggerRepository = {
  findAllAsync: vi.fn(),
  findByIdAsync: vi.fn(),
  createAsync: vi.fn(),
  updateAsync: vi.fn(),
  deleteAsync: vi.fn(),
  toggleStatusAsync: vi.fn(),
  incrementExecutionCountAsync: vi.fn(),
  getStatsAsync: vi.fn(),
} as const

describe('TriggerService', () => {
  let triggerService: TriggerService
  let mockRepository: typeof mockTriggerRepository

  beforeEach(() => {
    vi.clearAllMocks()
    mockRepository = mockTriggerRepository
    triggerService = new TriggerService(mockRepository as any)
  })

  describe('findAll', () => {
    it('should return paginated triggers successfully', async () => {
      // Arrange
      const query = { page: 1, limit: 10 }
      const mockData = [
        {
          id: 1,
          name: 'Test Trigger',
          type: 'schedule',
          targetType: 'workflow',
          workflowId: 'WF-001',
          status: 'active',
          isActive: true,
          executionCount: 5,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ]
      const mockTotal = 1

      mockRepository.findAllAsync.mockResolvedValue({ data: mockData, total: mockTotal })

      // Act
      const result = await triggerService.findAll(query)

      // Assert
      expect(result.success).toBe(true)
      expect(result.responseObject?.data).toEqual(mockData)
      expect(result.responseObject?.pagination.total).toBe(mockTotal)
      expect(result.responseObject?.pagination.totalPages).toBe(1)
      expect(mockRepository.findAllAsync).toHaveBeenCalledWith(query)
    })

    it('should handle repository errors', async () => {
      // Arrange
      const query = { page: 1, limit: 10 }
      mockRepository.findAllAsync.mockRejectedValue(new Error('Database error'))

      // Act
      const result = await triggerService.findAll(query)

      // Assert
      expect(result.success).toBe(false)
      expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(result.message).toContain('An error occurred while retrieving triggers')
    })
  })

  describe('findById', () => {
    it('should return a trigger when found', async () => {
      // Arrange
      const triggerId = 1
      const mockTrigger = {
        id: triggerId,
        name: 'Test Trigger',
        type: 'schedule',
        targetType: 'workflow',
        workflowId: 'WF-001',
        status: 'active',
        isActive: true,
        executionCount: 5,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }

      mockRepository.findByIdAsync.mockResolvedValue(mockTrigger)

      // Act
      const result = await triggerService.findById(triggerId)

      // Assert
      expect(result.success).toBe(true)
      expect(result.responseObject).toEqual(mockTrigger)
      expect(mockRepository.findByIdAsync).toHaveBeenCalledWith(triggerId)
    })

    it('should return not found when trigger does not exist', async () => {
      // Arrange
      const triggerId = 999
      mockRepository.findByIdAsync.mockResolvedValue(null)

      // Act
      const result = await triggerService.findById(triggerId)

      // Assert
      expect(result.success).toBe(false)
      expect(result.statusCode).toBe(StatusCodes.NOT_FOUND)
      expect(result.message).toBe('Trigger not found')
    })
  })

  describe('create', () => {
    it('should create a schedule trigger successfully', async () => {
      // Arrange  
      const createTriggerData: CreateTrigger = {
        name: 'Daily Report',
        type: 'schedule',
        targetType: 'workflow',
        workflowId: 'WF-001',
        scheduleFrequency: 'daily',
        isActive: true,
      }

      const mockCreatedTrigger = {
        id: 1,
        ...createTriggerData,
        status: 'active',
        executionCount: 0,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }

      mockRepository.createAsync.mockResolvedValue(mockCreatedTrigger)

      // Act
      const result = await triggerService.create(createTriggerData)

      // Assert
      expect(result.success).toBe(true)
      expect(result.statusCode).toBe(StatusCodes.CREATED)
      expect(result.responseObject).toEqual(mockCreatedTrigger)
      expect(mockRepository.createAsync).toHaveBeenCalledWith(createTriggerData)
    })

    it('should validate webhook trigger requirements', async () => {
      // Arrange
      const createTriggerData: CreateTrigger = {
        name: 'Invalid Webhook',
        type: 'webhook',
        targetType: 'workflow',
        workflowId: 'WF-001',
        // Missing webhookEndpoint and webhookMethod
        isActive: true,
      }

      // Act
      const result = await triggerService.create(createTriggerData)

      // Assert
      expect(result.success).toBe(false)
      expect(result.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(result.message).toContain('Webhook triggers require webhookEndpoint and webhookMethod')
    })
  })

  describe('execute', () => {
    it('should execute an active trigger successfully', async () => {
      // Arrange
      const triggerId = 1
      const mockTrigger = {
        id: triggerId,
        name: 'Test Trigger',
        type: 'schedule',
        targetType: 'workflow',
        workflowId: 'WF-001',
        status: 'active',
        isActive: true,
        executionCount: 5,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }

      mockRepository.findByIdAsync.mockResolvedValue(mockTrigger)
      mockRepository.incrementExecutionCountAsync.mockResolvedValue()

      // Act
      const result = await triggerService.execute(triggerId, 'admin')

      // Assert
      expect(result.success).toBe(true)
      expect(result.responseObject?.message).toContain('Test Trigger')
      expect(result.responseObject?.message).toContain('executed successfully')
      expect(mockRepository.incrementExecutionCountAsync).toHaveBeenCalledWith(triggerId)
    })

    it('should not execute inactive trigger', async () => {
      // Arrange
      const triggerId = 1
      const mockTrigger = {
        id: triggerId,
        name: 'Inactive Trigger',
        type: 'schedule',
        targetType: 'workflow',
        workflowId: 'WF-001',
        status: 'inactive',
        isActive: false,
        executionCount: 0,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }

      mockRepository.findByIdAsync.mockResolvedValue(mockTrigger)

      // Act
      const result = await triggerService.execute(triggerId)

      // Assert
      expect(result.success).toBe(false)
      expect(result.statusCode).toBe(StatusCodes.BAD_REQUEST)
      expect(result.message).toBe('Cannot execute inactive trigger')
      expect(mockRepository.incrementExecutionCountAsync).not.toHaveBeenCalled()
    })
  })

  describe('getStats', () => {
    it('should return trigger statistics', async () => {
      // Arrange
      const mockStats = {
        total: 10,
        active: 8,
        inactive: 2,
        error: 0,
        byType: {
          schedule: 4,
          webhook: 3,
          event: 2,
          data: 1,
        },
        totalExecutions: 1500,
      }

      mockRepository.getStatsAsync.mockResolvedValue(mockStats)

      // Act
      const result = await triggerService.getStats()

      // Assert
      expect(result.success).toBe(true)
      expect(result.responseObject).toEqual(mockStats)
      expect(mockRepository.getStatsAsync).toHaveBeenCalled()
    })
  })
})