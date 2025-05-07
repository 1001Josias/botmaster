export interface IWorker {
  id?: number
  key?: string
  name: string
  description?: string
  createdBy: number
  updatedBy: number
  createdAt?: Date
  updatedAt?: Date
}

export interface IWorkerContract<I = any, O> {
  createWorker: (...args: I) => O
}
