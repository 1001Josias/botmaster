import express, { type Router } from 'express'
import { jobController } from './jobController'
import { 
  CreateJobSchema, 
  JobKeyRouteParamsSchema, 
  UpdateJobSchema,
  GetJobsRouteQuerySchema 
} from './jobModel'
import { validateRequest } from '@/common/utils/httpHandlers'

export const jobsRouterV1: Router = express.Router({})

// GET /api/v1/jobs - Get all jobs with optional filtering and pagination
jobsRouterV1.get('/', validateRequest(GetJobsRouteQuerySchema, 'query'), jobController.getAll)

// GET /api/v1/jobs/stats - Get job statistics
jobsRouterV1.get('/stats', jobController.getStats)

// GET /api/v1/jobs/:key - Get a specific job by key
jobsRouterV1.get('/:key', validateRequest(JobKeyRouteParamsSchema, 'params'), jobController.getByKey)

// POST /api/v1/jobs - Create a new job
jobsRouterV1.post('/', validateRequest(CreateJobSchema, 'body'), jobController.create)

// PUT /api/v1/jobs/:key - Update a job
jobsRouterV1.put('/:key', 
  validateRequest(JobKeyRouteParamsSchema, 'params'),
  validateRequest(UpdateJobSchema, 'body'),
  jobController.update
)

// DELETE /api/v1/jobs/:key - Delete a job
jobsRouterV1.delete('/:key', validateRequest(JobKeyRouteParamsSchema, 'params'), jobController.delete)

// POST /api/v1/jobs/:key/start - Start a job
jobsRouterV1.post('/:key/start', validateRequest(JobKeyRouteParamsSchema, 'params'), jobController.startJob)

// POST /api/v1/jobs/:key/complete - Complete a job with result
jobsRouterV1.post('/:key/complete', validateRequest(JobKeyRouteParamsSchema, 'params'), jobController.completeJob)

// POST /api/v1/jobs/:key/fail - Mark a job as failed with error
jobsRouterV1.post('/:key/fail', validateRequest(JobKeyRouteParamsSchema, 'params'), jobController.failJob)