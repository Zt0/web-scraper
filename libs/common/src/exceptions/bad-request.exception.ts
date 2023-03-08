import {HttpStatus} from '@nestjs/common'
import {ResponseStatusCodes} from '@libs/common/dto/response-status.dto'
import {DefaultHttpException} from '@libs/common/exceptions/http.exception'

export class BadRequestException extends DefaultHttpException {
  constructor(message: string, failureReasons = ResponseStatusCodes.BadRequest, title?: string) {
    super({
      message: message,
      statusCode: HttpStatus.BAD_REQUEST,
      code: failureReasons,
      title: title,
    })
  }
}
