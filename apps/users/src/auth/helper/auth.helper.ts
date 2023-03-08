import * as bcrypt from 'bcrypt'
import * as speakeasy from 'speakeasy'
import {OtpCodes, OtpCodesDTO} from '@libs/common'
import {Config} from '@libs/common/configuration'
import {DateTimeUtil} from '@libs/common/utils/date-time-util'

export function otpCodeDTO(token: string, email: string): OtpCodesDTO {
  return {
    token,
    email,
    expiry: Number(DateTimeUtil.add(Config.get<number>('OTP_EXPIRY_TIME'), 'milliseconds')),
  }
}

export function generateOTP(): string {
  return speakeasy.totp({
    secret: Config.get('OTP_SECRET'),
    encoding: 'base32',
  })
}

export function invalidOTP(otpCode: OtpCodes): boolean {
  return !otpCode || Number(DateTimeUtil.now()) > otpCode.expiry
}

export function hash(password: string): Promise<string> {
  return bcrypt.hash(password, Number(Config.get<number>('ENCRYPTING_ROUNDS')))
}

export function compareWithEncrypted(data: string | Buffer, encrypted: string): Promise<boolean> {
  return bcrypt.compare(data, encrypted)
}
