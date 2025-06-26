export type ServiceResponseObjectError = {
  details?: string
  [key: string]: string | number | boolean | null
}

export type ServiceResponseErrorParams = {
  message: string
  responseObject: ServiceResponseObjectError | null
}
