export interface IWorkerContract<I = any, O> {
  createWorker: (...args: I) => O
}
