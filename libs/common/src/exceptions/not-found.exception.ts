import {HttpStatus} from '@nestjs/common'
import {DefaultHttpException} from '@libs/common/exceptions/http.exception'
import {ResponseStatusCodes} from '@libs/common/dto/response-status.dto'

export class NotFoundException extends DefaultHttpException {
  constructor(message: string) {
    super({
      message: message,
      statusCode: HttpStatus.NOT_FOUND,
      code: ResponseStatusCodes.NotFound,
    })
  }
}
