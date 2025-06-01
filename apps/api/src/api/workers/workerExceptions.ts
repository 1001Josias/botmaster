import { BusinessError } from '@/common/utils/errorHandlers'
import { StatusCodes } from 'http-status-codes'
import { CreateWorkerDto } from './workerModel'

export class WorkerException extends BusinessError {
  constructor(message: string) {
    super('Worker', message, StatusCodes.BAD_REQUEST)
  }
}

export class WorkerInvalidScopeRefException extends WorkerException {
  constructor(worker: CreateWorkerDto) {
    const message: string =
      worker.scope === 'public'
        ? 'ScopeRef must be null when scope is public. Please remove the scopeRef value.'
        : `ScopeRef must not be null when scope is ${worker.scope}. Please provide a valid scopeRef.`
    super(message)
  }
}
