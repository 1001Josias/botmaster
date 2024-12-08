import { Automation } from '@/api/automations/automationModel'
import { AutomationRepository } from '@/api/automations/automationRepository'
import { logger } from '@/server'

export class AutomationService {
  private automationRepository: AutomationRepository

  constructor(repository: AutomationRepository = new AutomationRepository()) {
    this.automationRepository = repository
  }

  async createAutomation(automation: Automation) {
    try {
      await this.automationRepository.createAutomation(automation)
    } catch (err) {
      const errorMessage = `Error creating automation: ${(err as Error).message}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }
  }
}
