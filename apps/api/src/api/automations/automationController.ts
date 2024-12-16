import { RequestHandler } from 'express'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { AutomationService } from '@/api/automations/automationService'
import { IAutomation, IAutomationContract } from '@/api/automations/automation'

export class AutomationController implements IAutomationContract<any, any> {
  private automationService: AutomationService

  constructor(service: AutomationService = new AutomationService()) {
    this.automationService = service
  }

  public createAutomation: RequestHandler<{}, {}, IAutomation> = async (req, res, next) => {
    try {
      const automationService = await this.automationService.createAutomation(req.body)
      return handleServiceResponse(automationService, res)
    } catch (err) {
      next(err)
    }
  }
}
