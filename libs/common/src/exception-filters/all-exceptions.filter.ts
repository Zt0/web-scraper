import {LogError} from '@libs/common/utils/logger'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common'
import {ResponseStatusCodes} from '@libs/common/dto/response-status.dto'
import {responseProperty} from '@libs/common/constants/constants'

/**
 * Changes error model response
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly isDevelopment: boolean) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const exceptionResponse = exception[responseProperty]

    // show the stack trace in responses for the 'development' env
    if (exception instanceof HttpException) {
      const httpException = exception as HttpException

      if (this.isDevelopment && typeof exceptionResponse === 'object' && httpException.stack) {
        ;(exceptionResponse as Record<string, unknown> & {stack: string}).stack =
          httpException.stack
      }
    }

    // If unknown
    if (!exceptionResponse) {
      LogError('AllExceptionsFilter', 'catch', {
        message: 'Unknown error in exception: ' + exception,
      })

      return response.status(status).send({
        data: null,
        status: {
          code: ResponseStatusCodes.UnknownError,
          message: !this.isDevelopment ? 'unknown error' : exception['message'],
        },
      })
    }

    let code, message, title

    try {
      code = exceptionResponse['code'] ?? exceptionResponse['statusCode']
      message = exceptionResponse['message']
      title = exceptionResponse['title']
      if (Array.isArray(message)) {
        message = message.join(', ')
      }
    } catch (error) {
      LogError('AllExceptionsFilter', 'catch get properties', {
        message: 'cant get one value: code, statusCode, message or title from exception',
      })
    }

    if (exception instanceof UnprocessableEntityException) {
      code = ResponseStatusCodes.UnprocessableEntity
    }

    response.status(status).send({
      data: null,
      status: {
        code,
        message,
        title,
      },
    })
  }
}
