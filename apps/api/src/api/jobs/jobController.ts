import { NextFunction, Request } from 'express'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { JobService } from '@/api/jobs/jobService'
import { CreateJobDto, JobResponseDto, UpdateJobDto, JobStatsResponseDto } from '@/api/jobs/jobModel'
import { ResponseCustom } from '@/common/utils/httpHandlers'
import { BaseController } from '@/common/controllers/baseController'

export class JobController extends BaseController<JobService> {
  constructor(service: JobService = new JobService()) {
    super(service)
  }

  public getAll = async (
    req: Request<{}, {}, {}, { page?: string; limit?: string; status?: string; workerKey?: string; flowKey?: string }>,
    res: ResponseCustom<{ jobs: JobResponseDto[]; total: number; page: number; limit: number }>,
    next: NextFunction
  ) => {
    try {
      return await this.context(req, async (jobService) => {
        const page = parseInt(req.query.page || '1')
        const limit = parseInt(req.query.limit || '20')
        const { status, workerKey, flowKey } = req.query
        const filters = { status: status as any, workerKey, flowKey }
        const jobs = await jobService.findAll(page, limit, filters)
        return handleServiceResponse(jobs, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public getByKey = async (
    req: Request<{ key: string }>,
    res: ResponseCustom<JobResponseDto, { key: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context(req, async (jobService) => {
        const { key } = req.params
        const job = await jobService.findByKey(key)
        return handleServiceResponse(job, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public create = async (
    req: Request<{}, {}, CreateJobDto>,
    res: ResponseCustom<JobResponseDto, CreateJobDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context(req, async (jobService) => {
        const jobData = res.locals.validatedData.body as CreateJobDto
        // TODO: Get actual user ID from authentication context
        const userId = 1 // Placeholder for now
        const createdJob = await jobService.create(jobData, userId)
        return handleServiceResponse(createdJob, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public update = async (
    req: Request<{ key: string }, {}, UpdateJobDto>,
    res: ResponseCustom<JobResponseDto, UpdateJobDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context(req, async (jobService) => {
        const { key } = req.params
        const updates = res.locals.validatedData.body as UpdateJobDto
        // TODO: Get actual user ID from authentication context
        const userId = 1 // Placeholder for now
        const updatedJob = await jobService.update(key, updates, userId)
        return handleServiceResponse(updatedJob, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public delete = async (
    req: Request<{ key: string }>,
    res: ResponseCustom<null, { key: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context(req, async (jobService) => {
        const { key } = req.params
        const result = await jobService.delete(key)
        return handleServiceResponse(result, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public getStats = async (
    req: Request,
    res: ResponseCustom<JobStatsResponseDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context(req, async (jobService) => {
        const stats = await jobService.getStats()
        return handleServiceResponse(stats, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public startJob = async (
    req: Request<{ key: string }>,
    res: ResponseCustom<JobResponseDto, { key: string }>,
    next: NextFunction
  ) => {
    try {
      return await this.context(req, async (jobService) => {
        const { key } = req.params
        // TODO: Get actual user ID from authentication context
        const userId = 1 // Placeholder for now
        const result = await jobService.startJob(key, userId)
        return handleServiceResponse(result, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public completeJob = async (
    req: Request<{ key: string }, {}, { result: Record<string, any> }>,
    res: ResponseCustom<JobResponseDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context(req, async (jobService) => {
        const { key } = req.params
        const { result } = req.body
        // TODO: Get actual user ID from authentication context
        const userId = 1 // Placeholder for now
        const jobResult = await jobService.completeJob(key, result, userId)
        return handleServiceResponse(jobResult, res)
      })
    } catch (err) {
      next(err)
    }
  }

  public failJob = async (
    req: Request<{ key: string }, {}, { error: string }>,
    res: ResponseCustom<JobResponseDto>,
    next: NextFunction
  ) => {
    try {
      return await this.context(req, async (jobService) => {
        const { key } = req.params
        const { error } = req.body
        // TODO: Get actual user ID from authentication context
        const userId = 1 // Placeholder for now
        const result = await jobService.failJob(key, error, userId)
        return handleServiceResponse(result, res)
      })
    } catch (err) {
      next(err)
    }
  }
}

export const jobController = new JobController()