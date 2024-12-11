import { StatusCodes } from 'http-status-codes'

import { AutomationRepository } from '@/api/automations/automationRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { logger } from '@/server'
import { IAutomation, IAutomationContract } from '@/api/automations/automation'

export class AutomationService implements IAutomationContract<any, Promise<ServiceResponse<IAutomation | null>>> {
  private automationRepository: AutomationRepository

  constructor(repository: AutomationRepository = new AutomationRepository()) {
    this.automationRepository = repository
  }

  async createAutomation(automation: IAutomation): Promise<ServiceResponse<IAutomation | null>> {
    try {
      const createdAutomation = await this.automationRepository.createAutomation(automation)
      return ServiceResponse.success<IAutomation>(
        'Automation created successfully',
        createdAutomation,
        StatusCodes.CREATED,
      )
    } catch (err) {
      const errorMessage = `Error creating automation: ${(err as Error).message}`
      logger.error(errorMessage)
      return ServiceResponse.failure(errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
}
