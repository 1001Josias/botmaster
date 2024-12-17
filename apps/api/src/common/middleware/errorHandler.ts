import { logger } from '@/server'
import type { ErrorRequestHandler, RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ServiceResponse } from '../models/serviceResponse'

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
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    error: 'INTERNAL_SERVER_ERROR: Please try again later.',
  })
}

export default () => [unexpectedRequest, addErrorToRequestLog, internalServerErrorResponse]
