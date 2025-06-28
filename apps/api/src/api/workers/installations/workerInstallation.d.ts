export interface IWorkerInstallation<I extends unknown[] = unknown[], O = unknown> {
  install: (...args: I) => O
}
