import { logger } from '@/server'
import type { ErrorRequestHandler, RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND)
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
