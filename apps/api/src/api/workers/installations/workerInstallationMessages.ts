export class WorkerInstallationMessages {
  static installedSuccessfullyMessage: string = 'Worker installed successfully'
}

export const workerInstallationConstraintErrorMessages = {}

export type WorkerInstallationConstraints = keyof typeof workerInstallationConstraintErrorMessages
