import { Request } from 'express'
import { BaseService } from '../services/baseService'
import { ContextDto } from '../utils/commonValidation'

export class BaseController<Service extends BaseService> {
  protected service: Service

  constructor(service: Service) {
    this.service = service
  }

  protected async context<T>(req: Request<any>, handler: (service: Service) => Promise<T>): Promise<T> {
    const context = this.getContext(req)
    this.service.setContext(context)
    return handler(this.service)
  }

  private getContext(req: Request): ContextDto {
    return {
      folderKey: req.headers['x-folder-key'] as string,
      tenantKey: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      organization: 'community',
    }
  }
}
