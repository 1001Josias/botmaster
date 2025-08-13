import type { Request, RequestHandler, Response } from 'express'

import { BaseController } from '@/common/controllers/baseController'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { FolderService } from './folderService'

class FolderController extends BaseController<FolderService> {
  constructor() {
    super(new FolderService())
  }

  public getFolders: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await this.context(req, async (service) => {
      return await service.findAll()
    })
    return handleServiceResponse(serviceResponse, res)
  }

  public getFolder: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10)
    const serviceResponse = await this.context(req, async (service) => {
      return await service.findById(id)
    })
    return handleServiceResponse(serviceResponse, res)
  }

  public createFolder: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await this.context(req, async (service) => {
      return await service.create(req.body)
    })
    return handleServiceResponse(serviceResponse, res)
  }

  public updateFolder: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10)
    const serviceResponse = await this.context(req, async (service) => {
      return await service.update(id, req.body)
    })
    return handleServiceResponse(serviceResponse, res)
  }

  public deleteFolder: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10)
    const serviceResponse = await this.context(req, async (service) => {
      return await service.delete(id)
    })
    return handleServiceResponse(serviceResponse, res)
  }
}

export const folderController = new FolderController()