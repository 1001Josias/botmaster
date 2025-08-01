import { NextFunction, Request } from 'express'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { WorkerService } from '@/api/workers/workerService'
import { IWorker } from '@/api/workers/worker'
import { CreateWorkerDto, WorkerResponseDto, UpdateWorkerDto, UpdateWorkerStatusDto, GetWorkersRouteQuerySchema } from '@/api/workers/workerModel'
import { ResponseCustom } from '@/common/utils/httpHandlers'
import { BaseController } from '@/common/controllers/baseController'
import { WorkerResponseMessages } from './workerResponseMessages'
import { z } from 'zod'

type GetWorkersQuery = z.infer<typeof GetWorkersRouteQuerySchema>

export class WorkerController extends BaseController<WorkerService> {
  constructor(service: WorkerService = new WorkerService()) {
    super(service)
  }

  public getAll = async (
    req: Request,
    res: ResponseCustom<any>,
    next: NextFunction
  ) => {
    try {
      return await this.context<WorkerResponseMessages>(req, async (workerService) => {
        // Parse and validate query parameters
        const queryResult = GetWorkersRouteQuerySchema.safeParse(req.query)
        if (!queryResult.success) {
          return res.status(400).json({
            success: false,
            message: 'Invalid query parameters',
            errors: queryResult.error.errors,
          })
        }

        const workers = await workerService.getAll(queryResult.data)
        return handleServiceResponse(workers, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public getById = async (
    req: Request<{ id: string }>,
    res: ResponseCustom<WorkerResponseDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context<WorkerResponseMessages>(req, async (workerService) => {
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid worker ID',
          })
        }

        const worker = await workerService.getById(id)
        return handleServiceResponse(worker, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public getByKey = async (
    req: Request<{ key: string }>,
    res: ResponseCustom<WorkerResponseDto, { key: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context<WorkerResponseMessages>(req, async (workerService) => {
        const { key } = req.params
        const worker = await workerService.getByKey(key)
        return handleServiceResponse(worker, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public create = async (
    req: Request<CreateWorkerDto>,
    res: ResponseCustom<WorkerResponseDto, CreateWorkerDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context<WorkerResponseMessages>(req, async (workerService) => {
        const worker = res.locals.validatedData.body as CreateWorkerDto
        const createdWorker = await workerService.create(worker)
        return handleServiceResponse(createdWorker, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public update = async (
    req: Request<{ id: string }>,
    res: ResponseCustom<WorkerResponseDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context<WorkerResponseMessages>(req, async (workerService) => {
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid worker ID',
          })
        }

        const updateData = req.body as UpdateWorkerDto
        const updatedWorker = await workerService.update(id, updateData)
        return handleServiceResponse(updatedWorker, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public updateStatus = async (
    req: Request<{ id: string }>,
    res: ResponseCustom<WorkerResponseDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context<WorkerResponseMessages>(req, async (workerService) => {
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid worker ID',
          })
        }

        const statusData = req.body as UpdateWorkerStatusDto
        const updatedWorker = await workerService.updateStatus(id, statusData)
        return handleServiceResponse(updatedWorker, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public delete = async (
    req: Request<{ id: string }>,
    res: ResponseCustom<WorkerResponseDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context<WorkerResponseMessages>(req, async (workerService) => {
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid worker ID',
          })
        }

        const deletedWorker = await workerService.delete(id)
        return handleServiceResponse(deletedWorker, res)
      })
    } catch (err) {
      next(err)
    }
  }
}

export const workerController = new WorkerController()
