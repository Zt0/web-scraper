import {ConfigType} from '@libs/common/types/config'
import {DurationInMilliseconds} from '@libs/common/enums/duration'

export const devConfig: ConfigType = {
  FEATURE_ASYNC_LOCAL_STORAGE: 'disabled',
  CORS_DOMAINS: ['http://localhost:3000'],
  OTP_EXPIRY_TIME: DurationInMilliseconds.QuarterHour,
}
