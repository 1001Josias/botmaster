import type { Request, RequestHandler, Response } from 'express'

import { triggerService } from './triggerService'
import { handleServiceResponse } from '@/common/utils/httpHandlers'
import { GetTriggersQuerySchema } from './triggerModel'
import { logger } from '@/server'

class TriggerController {
  // GET /triggers - List all triggers with pagination and filtering
  public getTriggers: RequestHandler = async (req: Request, res: Response) => {
    try {
      // Validate and parse query parameters
      const queryResult = GetTriggersQuerySchema.safeParse(req.query)
      
      if (!queryResult.success) {
        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: queryResult.error.errors,
        })
      }

      const serviceResponse = await triggerService.findAll(queryResult.data)
      return handleServiceResponse(serviceResponse, res)
    } catch (error) {
      logger.error('Error in getTriggers:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  }

  // GET /triggers/:id - Get a trigger by ID
  public getTrigger: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = Number.parseInt(req.params.id as string, 10)
      
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid trigger ID',
        })
      }

      const serviceResponse = await triggerService.findById(id)
      return handleServiceResponse(serviceResponse, res)
    } catch (error) {
      logger.error('Error in getTrigger:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  }

  // POST /triggers - Create a new trigger
  public createTrigger: RequestHandler = async (req: Request, res: Response) => {
    try {
      const serviceResponse = await triggerService.create(req.body)
      return handleServiceResponse(serviceResponse, res)
    } catch (error) {
      logger.error('Error in createTrigger:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  }

  // PUT /triggers/:id - Update a trigger
  public updateTrigger: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = Number.parseInt(req.params.id as string, 10)
      
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid trigger ID',
        })
      }

      const serviceResponse = await triggerService.update(id, req.body)
      return handleServiceResponse(serviceResponse, res)
    } catch (error) {
      logger.error('Error in updateTrigger:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  }

  // DELETE /triggers/:id - Delete a trigger
  public deleteTrigger: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = Number.parseInt(req.params.id as string, 10)
      
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid trigger ID',
        })
      }

      const serviceResponse = await triggerService.delete(id)
      return handleServiceResponse(serviceResponse, res)
    } catch (error) {
      logger.error('Error in deleteTrigger:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  }

  // PATCH /triggers/:id/status - Toggle trigger status
  public toggleTriggerStatus: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = Number.parseInt(req.params.id as string, 10)
      
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid trigger ID',
        })
      }

      const { isActive, updatedBy } = req.body

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'isActive must be a boolean value',
        })
      }

      const serviceResponse = await triggerService.toggleStatus(id, isActive, updatedBy)
      return handleServiceResponse(serviceResponse, res)
    } catch (error) {
      logger.error('Error in toggleTriggerStatus:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  }

  // POST /triggers/:id/execute - Execute a trigger manually
  public executeTrigger: RequestHandler = async (req: Request, res: Response) => {
    try {
      const id = Number.parseInt(req.params.id as string, 10)
      
      if (Number.isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid trigger ID',
        })
      }

      const { executedBy } = req.body
      const serviceResponse = await triggerService.execute(id, executedBy)
      return handleServiceResponse(serviceResponse, res)
    } catch (error) {
      logger.error('Error in executeTrigger:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  }

  // GET /triggers/stats - Get trigger statistics
  public getTriggerStats: RequestHandler = async (_req: Request, res: Response) => {
    try {
      const serviceResponse = await triggerService.getStats()
      return handleServiceResponse(serviceResponse, res)
    } catch (error) {
      logger.error('Error in getTriggerStats:', error)
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      })
    }
  }
}

export const triggerController = new TriggerController()