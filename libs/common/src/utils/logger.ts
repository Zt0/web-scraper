import {getRequestContext} from '@libs/common/async-hook'
import {Logger} from '@nestjs/common'
import {LoggerContext} from '@libs/common/types/logger'

export const loggerPayload = <T>(context: LoggerContext, data: T): LoggerContext & T => {
  const {functionName, eventName} = context
  const requestId = getRequestContext()

  return {functionName, eventName, requestId, ...data}
}

export const LogInfo = (
  functionName: string,
  eventName: string,
  data: Record<string, unknown>,
): void => {
  Logger.log(loggerPayload({functionName, eventName}, data))
}

export const LogWarn = (
  functionName: string,
  eventName: string,
  data: Record<string, unknown>,
): void => {
  Logger.warn(loggerPayload({functionName, eventName}, data))
}

export const LogError = (
  functionName: string,
  eventName: string,
  data: Record<string, unknown>,
): void => {
  Logger.error(loggerPayload({functionName, eventName}, data))
}
