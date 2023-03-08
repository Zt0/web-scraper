/**
 * Generic response status
 */
export class ResponseStatus {
  code: ResponseStatusCodes | string

  message: string
}

export class Response {
  data: unknown
  status: ResponseStatus
}

/**
 * Default status codes
 */
export enum ResponseStatusCodes {
  Succeed = 'succeed',
  Failed = 'failed',
  BadRequest = 'bad_request',
  InternalServerError = 'internal_server_error',
  Unauthorized = 'unauthorized',
  NotFound = 'not_found',
  UnknownError = 'unknown_error',
  UnprocessableEntity = 'unprocessable_entity',
}
