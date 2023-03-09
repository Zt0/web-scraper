import {RequestMetadata} from '@libs/common/types/request'

export type LoggerContext = {
  functionName: string
  eventName: string
  requestId?: RequestMetadata
}
