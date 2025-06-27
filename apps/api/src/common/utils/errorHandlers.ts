export class InternalError {
  error = 'An unexpected error occurred. If this error persists, please contact support.'
  constructor() {}
}

export enum SystemErrorMessages {
  SYNTAX_ERROR = 'The request body contains malformed JSON. Correct the structure and try again.',
}
