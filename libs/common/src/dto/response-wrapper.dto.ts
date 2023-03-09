/**
 * Generic response wrapper.
 * Allows every response to be wrapped into a standard object that contains:
 * - a status
 * - the data (nullable)
 * - some pagination details if any.
 */
import {ResponseStatus, ResponseStatusCodes} from '@libs/common/dto/response-status.dto'

export class ResponseWrapper<T = unknown> {
  status: ResponseStatus

  data: T

  currentPage?: number

  totalPages?: number

  totalItems?: number

  // eslint-disable-next-line max-params
  static of<T>(
    data: T,
    code: ResponseStatusCodes,
    message: string = null,
    title?: string,
    pageSize?: number,
    currentPage?: number,
    totalItems?: number,
  ): ResponseWrapper<T> {
    return {
      data,
      status: {code, message, title},
      pageSize,
      currentPage,
      totalItems,
    } as ResponseWrapper<T>
  }

  // eslint-disable-next-line max-params
  static actionSucceed<T>(
    data: T = null,
    message?: string,
    code = ResponseStatusCodes.Succeed,
    title?: string,
  ): ResponseWrapper<T> {
    return ResponseWrapper.of(data, code, message, title)
  }
}
