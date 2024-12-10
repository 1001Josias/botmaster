import { StatusCodes } from 'http-status-codes'

import { Automation } from '@/api/automations/automationModel'
import { AutomationRepository } from '@/api/automations/automationRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { logger } from '@/server'

export class AutomationService {
  private automationRepository: AutomationRepository

  constructor(repository: AutomationRepository = new AutomationRepository()) {
    this.automationRepository = repository
  }

  async createAutomation(automation: Automation) {
    try {
      const createdAutomation = await this.automationRepository.createAutomation(automation)
      return ServiceResponse.success<Automation>(
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
