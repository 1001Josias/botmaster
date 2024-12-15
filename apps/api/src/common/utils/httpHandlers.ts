import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ZodError, ZodSchema } from 'zod'

import { ServiceResponse } from '@/common/models/serviceResponse'
import { logger } from '@/server'

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse)
}

type ValidateRequestContext = 'body' | 'query' | 'params'

export const validateRequest =
  (schema: ZodSchema, context: ValidateRequestContext) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[context])
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        logger.warn(err.errors)
        const message = `Invalid request ${context}`
        const errors = err.issues.map(({ message, path }) => `'${path.toString()}' ${message}`)
        const serviceResponse = ServiceResponse.failure(message, { errors }, StatusCodes.BAD_REQUEST)
        return handleServiceResponse(serviceResponse, res)
      }
      next(err)
    }
  }
