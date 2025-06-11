// export interface IWorker<I = any, O> {
//   create: (...args: I) => O
//   // update(worker: I): O
//   // delete(worker: I): O
//   // get(worker: I): O
//   // getAll(worker: I): O
//   // getById(worker: I): O
//   // getByKey(worker: I): O
//   // getByFolderKey(worker: I): O
//   // getByTenantKey(worker: I): O
//   // getByCreatedBy(worker: I): O
//   // getByUpdatedBy(worker: I): O
// }

export interface IWorker<I extends unknown[] = unknown[], O = unknown> {
  create: (...args: I) => O
}
