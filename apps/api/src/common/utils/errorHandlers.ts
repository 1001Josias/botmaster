export class BusinessError extends Error {
  constructor(entity_name: string, message: string) {
    super(message)
    const entity = entity_name.charAt(0).toUpperCase() + entity_name.slice(1)
    this.name = `${entity}BusinessError`
  }
}
