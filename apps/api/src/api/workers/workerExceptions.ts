import { CreateWorkerDto } from './workerModel'

export class WorkerInvalidScopeRefException {
  constructor(worker: CreateWorkerDto) {
    const message: string =
      worker.scope === 'public'
        ? 'ScopeRef must be null when scope is public. Please remove the scopeRef value.'
        : `ScopeRef must not be null when scope is ${worker.scope}. Please provide a valid scopeRef.`
  }
}
