import type { Request, RequestHandler, Response } from 'express'

import { BaseController } from '@/common/controllers/baseController'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { TenantService } from './tenantService'

class TenantController extends BaseController<TenantService> {
  constructor() {
    super(new TenantService())
  }

  public getTenants: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await this.context(req, async (service) => {
      return await service.findAll()
    })
    return handleServiceResponse(serviceResponse, res)
  }

  public getTenant: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10)
    const serviceResponse = await this.context(req, async (service) => {
      return await service.findById(id)
    })
    return handleServiceResponse(serviceResponse, res)
  }

  public createTenant: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await this.context(req, async (service) => {
      return await service.create(req.body)
    })
    return handleServiceResponse(serviceResponse, res)
  }

  public updateTenant: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10)
    const serviceResponse = await this.context(req, async (service) => {
      return await service.update(id, req.body)
    })
    return handleServiceResponse(serviceResponse, res)
  }

  public deleteTenant: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10)
    const serviceResponse = await this.context(req, async (service) => {
      return await service.delete(id)
    })
    return handleServiceResponse(serviceResponse, res)
  }
}

export const tenantController = new TenantController()