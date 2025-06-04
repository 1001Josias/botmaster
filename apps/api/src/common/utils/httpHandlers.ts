import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import z, { ZodError, ZodSchema } from 'zod'
import { ServiceResponse } from '@/common/models/serviceResponse'
import { logger } from '@/server'

export const handleServiceResponse = <T>(serviceResponse: ServiceResponse<T>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse)
}

type ValidateRequestContext = 'body' | 'query' | 'params'

type Locals<B, Q, P> = {
  validatedData: {
    body?: B
    query?: Q
    params?: P
  }
}

export type ResponseCustom<ResBody, ValBody = undefined, ValQuery = undefined, ValParams = undefined> = Response<
  ResBody,
  Locals<ValBody, ValQuery, ValParams>
>

export function validateRequest<I, O>(schema: ZodSchema, context: ValidateRequestContext) {
  return (
    req: Request<I>,
    res: ResponseCustom<O, z.infer<typeof schema>, z.infer<typeof schema>, z.infer<typeof schema>>,
    next: NextFunction
  ) => {
    try {
      res.locals = { validatedData: { [context]: schema.parse(req[context]) } }
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
}
