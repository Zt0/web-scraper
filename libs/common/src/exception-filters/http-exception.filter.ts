import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from '@nestjs/common'
import {FastifyReply, RawServerBase} from 'fastify'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private isDevelopment: boolean

  constructor(isDevelopment: boolean) {
    this.isDevelopment = isDevelopment
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<FastifyReply<RawServerBase>>()

    const exceptionResponse = exception.getResponse()

    // show the stack trace in responses for the 'development' env
    if (this.isDevelopment && typeof exceptionResponse === 'object' && exception.stack) {
      ;(exceptionResponse as Record<string, unknown> & {stack: string}).stack = exception.stack
    }

    response.status(exception.getStatus()).send(exceptionResponse)
  }
}
