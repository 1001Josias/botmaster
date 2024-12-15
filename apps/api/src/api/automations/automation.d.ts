export interface IAutomation {
  id?: number
  key?: string
  name: string
  description?: string
  createdBy: number
  updatedBy: number
  createdAt?: Date
  updatedAt?: Date
}

export interface IAutomationContract<I = any, O> {
  createAutomation: (...args: I) => O
}
