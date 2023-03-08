import {HttpException, HttpStatus} from '@nestjs/common'
import {ResponseStatusCodes} from '@libs/common/dto/response-status.dto'

export class DtoValidationException extends HttpException {
  constructor(
    message?: string | Record<string, unknown> | unknown,
    error = 'Dto Validation Error',
  ) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error,
        message,
        code: ResponseStatusCodes.BadRequest,
      },
      HttpStatus.BAD_REQUEST,
    )
  }
}
