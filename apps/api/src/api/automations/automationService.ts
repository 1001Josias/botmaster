import { StatusCodes } from 'http-status-codes'

import { AutomationRepository } from '@/api/automations/automationRepository'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { IAutomation, IAutomationContract } from '@/api/automations/automation'
import { BusinessError } from '@/common/utils/errorHandlers'

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
        return ServiceResponse.failure(err.message, null, StatusCodes.BAD_REQUEST)
      }
      throw err
    }
  }
}
