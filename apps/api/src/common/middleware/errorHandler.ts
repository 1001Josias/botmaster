import { logger } from '@/server'
import type { ErrorRequestHandler, RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ServiceResponse } from '../models/serviceResponse'
import { InternalError } from '../utils/errorHandlers'

const unexpectedRequest: RequestHandler = (req, res) => {
  const apiDocsUrl = `${req.protocol}://${req.get('host')}/api-docs/v1`
  const message = `Unexpected request. See our API documentation: ${apiDocsUrl}`
  const error = `Route not found: ${req.method} ${req.originalUrl}`
  logger.warn(message)
  const response = ServiceResponse.failure(message, { error }, StatusCodes.NOT_FOUND)
  res.status(response.statusCode).send(response)
}

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  res.locals.err = err
  next(err)
}

const internalServerErrorResponse: ErrorRequestHandler = (err, _req, res, _next) => {
  logger.error(err)
  const response = ServiceResponse.failure('Internal error.', new InternalError(), StatusCodes.INTERNAL_SERVER_ERROR)
  res.status(response.statusCode).send(response)
}

export default () => [unexpectedRequest, addErrorToRequestLog, internalServerErrorResponse]
