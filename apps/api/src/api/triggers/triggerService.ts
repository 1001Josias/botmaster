import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

import type { 
  Trigger, 
  CreateTrigger, 
  UpdateTrigger, 
  TriggerStats 
} from './triggerModel'
import { TriggerRepository } from './triggerRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { logger } from '@/server'

type GetTriggersQuery = z.infer<typeof import('./triggerModel').GetTriggersQuerySchema>

interface PaginatedTriggers {
  data: Trigger[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export class TriggerService {
  private triggerRepository: TriggerRepository

  constructor(repository: TriggerRepository = new TriggerRepository()) {
    this.triggerRepository = repository
  }

  // Retrieves all triggers with pagination and filtering
  async findAll(query: GetTriggersQuery): Promise<ServiceResponse<PaginatedTriggers | null>> {
    try {
      const { data, total } = await this.triggerRepository.findAllAsync(query)
      
      const totalPages = Math.ceil(total / query.limit)
      
      const response: PaginatedTriggers = {
        data,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages,
        },
      }

      return ServiceResponse.success<PaginatedTriggers>('Triggers found', response)
    } catch (ex) {
      const errorMessage = `Error finding all triggers: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponse.failure(
        'An error occurred while retrieving triggers.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  // Retrieves a single trigger by its ID
  async findById(id: number): Promise<ServiceResponse<Trigger | null>> {
    try {
      const trigger = await this.triggerRepository.findByIdAsync(id)
      if (!trigger) {
        return ServiceResponse.failure('Trigger not found', null, StatusCodes.NOT_FOUND)
      }
      return ServiceResponse.success<Trigger>('Trigger found', trigger)
    } catch (ex) {
      const errorMessage = `Error finding trigger with id ${id}: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponse.failure(
        'An error occurred while finding trigger.', 
        null, 
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
  }

  // Creates a new trigger
  async create(triggerData: CreateTrigger): Promise<ServiceResponse<Trigger | null>> {
    try {
      // Validate type-specific requirements
      const validationError = this.validateTriggerData(triggerData)
      if (validationError) {
        return ServiceResponse.failure(validationError, null, StatusCodes.BAD_REQUEST)
      }

      const trigger = await this.triggerRepository.createAsync(triggerData)
      return ServiceResponse.success<Trigger>('Trigger created successfully', trigger, StatusCodes.CREATED)
    } catch (ex) {
      const errorMessage = `Error creating trigger: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponse.failure(
        'An error occurred while creating trigger.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  // Updates an existing trigger
  async update(id: number, triggerData: UpdateTrigger): Promise<ServiceResponse<Trigger | null>> {
    try {
      const trigger = await this.triggerRepository.updateAsync(id, triggerData)
      if (!trigger) {
        return ServiceResponse.failure('Trigger not found', null, StatusCodes.NOT_FOUND)
      }
      return ServiceResponse.success<Trigger>('Trigger updated successfully', trigger)
    } catch (ex) {
      const errorMessage = `Error updating trigger with id ${id}: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponse.failure(
        'An error occurred while updating trigger.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  // Deletes a trigger
  async delete(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const deleted = await this.triggerRepository.deleteAsync(id)
      if (!deleted) {
        return ServiceResponse.failure('Trigger not found', false, StatusCodes.NOT_FOUND)
      }
      return ServiceResponse.success<boolean>('Trigger deleted successfully', true)
    } catch (ex) {
      const errorMessage = `Error deleting trigger with id ${id}: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponse.failure(
        'An error occurred while deleting trigger.',
        false,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  // Toggles trigger active status
  async toggleStatus(id: number, isActive: boolean, updatedBy?: string): Promise<ServiceResponse<Trigger | null>> {
    try {
      const trigger = await this.triggerRepository.toggleStatusAsync(id, isActive, updatedBy)
      if (!trigger) {
        return ServiceResponse.failure('Trigger not found', null, StatusCodes.NOT_FOUND)
      }
      
      const statusText = isActive ? 'activated' : 'deactivated'
      return ServiceResponse.success<Trigger>(`Trigger ${statusText} successfully`, trigger)
    } catch (ex) {
      const errorMessage = `Error toggling trigger status for id ${id}: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponse.failure(
        'An error occurred while toggling trigger status.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  // Executes a trigger manually
  async execute(id: number, executedBy?: string): Promise<ServiceResponse<{ message: string } | null>> {
    try {
      // First check if trigger exists and is active
      const trigger = await this.triggerRepository.findByIdAsync(id)
      if (!trigger) {
        return ServiceResponse.failure('Trigger not found', null, StatusCodes.NOT_FOUND)
      }

      if (!trigger.isActive) {
        return ServiceResponse.failure(
          'Cannot execute inactive trigger', 
          null, 
          StatusCodes.BAD_REQUEST
        )
      }

      // Increment execution count
      await this.triggerRepository.incrementExecutionCountAsync(id)

      // In a real implementation, this would trigger the actual workflow/worker execution
      // For now, we'll just return a success message
      const message = `Trigger "${trigger.name}" executed successfully`
      
      logger.info(`Manual execution of trigger ${id} by ${executedBy || 'system'}`)
      
      return ServiceResponse.success<{ message: string }>('Trigger executed', { message })
    } catch (ex) {
      const errorMessage = `Error executing trigger with id ${id}: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponse.failure(
        'An error occurred while executing trigger.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  // Gets trigger statistics
  async getStats(): Promise<ServiceResponse<TriggerStats | null>> {
    try {
      const stats = await this.triggerRepository.getStatsAsync()
      return ServiceResponse.success<TriggerStats>('Trigger stats retrieved', stats)
    } catch (ex) {
      const errorMessage = `Error getting trigger stats: ${(ex as Error).message}`
      logger.error(errorMessage)
      return ServiceResponse.failure(
        'An error occurred while retrieving trigger stats.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      )
    }
  }

  // Private method to validate trigger type-specific data
  private validateTriggerData(triggerData: CreateTrigger | UpdateTrigger): string | null {
    // Only validate if we have type information
    if (!triggerData.type) {
      return null
    }

    switch (triggerData.type) {
      case 'schedule':
        if (!triggerData.scheduleFrequency && !triggerData.cronExpression) {
          return 'Schedule triggers require either scheduleFrequency or cronExpression'
        }
        break
      
      case 'webhook':
        if (!triggerData.webhookEndpoint || !triggerData.webhookMethod) {
          return 'Webhook triggers require webhookEndpoint and webhookMethod'
        }
        break
      
      case 'event':
        if (!triggerData.eventSource || !triggerData.eventName) {
          return 'Event triggers require eventSource and eventName'
        }
        break
      
      case 'data':
        if (!triggerData.dataSource || !triggerData.dataCondition) {
          return 'Data triggers require dataSource and dataCondition'
        }
        break
    }

    // Validate target requirements
    if (triggerData.targetType === 'workflow' && !triggerData.workflowId) {
      return 'Workflow triggers require workflowId'
    }
    
    if (triggerData.targetType === 'worker' && !triggerData.workerId) {
      return 'Worker triggers require workerId'
    }

    return null
  }
}

export const triggerService = new TriggerService()