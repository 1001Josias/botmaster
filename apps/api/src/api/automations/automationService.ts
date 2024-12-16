import { StatusCodes } from 'http-status-codes'

import { AutomationRepository } from '@/api/automations/automationRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { IAutomation, IAutomationContract } from '@/api/automations/automation'
import { BusinessError } from '@/common/utils/errorHandlers'
import { logger } from '@/server'

export class AutomationService implements IAutomationContract<any, Promise<ServiceResponse<IAutomation | null>>> {
  private automationRepository: AutomationRepository

  constructor(repository: AutomationRepository = new AutomationRepository()) {
    this.automationRepository = repository
  }

  async createAutomation(automation: IAutomation): Promise<ServiceResponse<IAutomation | null>> {
    try {
      const createdAutomation = await this.automationRepository.createAutomation(automation)
      const message = `Automation created successfully`
      return ServiceResponse.success(message, createdAutomation, StatusCodes.CREATED)
    } catch (err) {
      if (err instanceof BusinessError) {
        logger.warn(`${err.name}: ${err.message}`)
        return ServiceResponse.failure(err.message, null, err.status)
      }
      throw err
    }
  }
}
