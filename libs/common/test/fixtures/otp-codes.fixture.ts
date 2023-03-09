import {OtpCodes} from '@libs/common/entities'
import {DateTimeUtil} from '@libs/common/utils/date-time-util'

export const expiredOtpCode: Partial<OtpCodes> = {
  id: 1,
  expiry: Number(DateTimeUtil.add(-20, 'minutes')),
  token: '111111',
}

export const activeOtpCode: Partial<OtpCodes> = {
  id: 2,
  expiry: Number(DateTimeUtil.add(+25, 'minutes')),
  token: '222222',
}
