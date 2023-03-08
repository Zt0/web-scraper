import {HttpException} from '@nestjs/common'
import {ResponseStatusCodes} from '@libs/common/dto/response-status.dto'

export class DefaultHttpException extends HttpException {
  constructor(data: {
    message: string
    statusCode: number
    code: ResponseStatusCodes
    title?: string
  }) {
    super({message: data.message, code: data.code}, data.statusCode)
  }
}
