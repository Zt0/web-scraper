import {ArgumentsHost, Catch, HttpException, HttpServer} from '@nestjs/common'
import {BaseExceptionFilter} from '@nestjs/core'
import * as activityLogs from '@libs/common/enums/activity-logs'
import {LogInfo} from '@libs/common/utils'
import {ResponseStatusCodes} from '@libs/common/dto/response-status.dto'

@Catch()
export class UnhandledExceptionsFilter extends BaseExceptionFilter {
  constructor(applicationRef: HttpServer) {
    super(applicationRef)
  }

  catch(exception: Error, host: ArgumentsHost): Promise<void> {
    if (!(exception instanceof HttpException)) {
      return this.handleUnknownError(exception, host)
    }
    super.catch(exception, host)
  }

  public async handleUnknownError(exception: Error, host: ArgumentsHost): Promise<void> {
    const body = {
      message: 'Internal server error',
    }
    this.applicationRef.reply(host.getArgByIndex(1), body)
    if (this.isExceptionObject(exception)) {
      LogInfo(
        activityLogs.UnhandledExceptionsFilterEnum.HandleUnknownError,
        activityLogs.AuthServiceActions.Failed,
        {
          message: ResponseStatusCodes.UnknownError,
          exceptionStack: exception.stack,
          exception,
        },
      )
    }
  }
}
