export interface IWorker {
  id?: number
  key?: string
  name: string
  description?: string
  createdBy: number
  updatedBy: number
  createdAt?: Date
  updatedAt?: Date
  folderKey: string
  tenantKey: string
}

export interface IWorkerContract<I = any, O> {
  createWorker: (...args: I) => O
}
