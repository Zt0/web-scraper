import {HttpStatus} from '@nestjs/common'
import {DefaultHttpException} from '@libs/common/exceptions/http.exception'
import {ResponseStatusCodes} from '@libs/common/dto/response-status.dto'

export class UnauthorizedException extends DefaultHttpException {
  constructor(message: string) {
    super({
      message: message,
      statusCode: HttpStatus.UNAUTHORIZED,
      code: ResponseStatusCodes.Unauthorized,
    })
  }
}
