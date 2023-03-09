import {IsEmail, IsJWT, IsString, Matches, MaxLength, MinLength} from 'class-validator'
import {regExPassword} from '@libs/common/helpers/regexps'

export class EmailDTO {
  @IsEmail() email: string
}

export class PasswordDTO {
  @IsString()
  @MinLength(8)
  @MaxLength(256)
  @Matches(regExPassword)
  password: string
}

export class LogInDTO extends EmailDTO {
  @IsString()
  @MinLength(8)
  @MaxLength(256)
  @Matches(regExPassword)
  password: string
}

export class RegisterDTO extends LogInDTO {}

export class AuthResponseDTO {
  @IsString()
  uuid: string
}

export class RefreshTokenDTO {
  @IsJWT()
  refreshToken: string
}

export class AccessTokenDTO {
  accessToken: string
}

export class VerifyOtpTokenDTO {
  verifyOtpToken: string
}

export class TokensDTO {
  accessToken: string
  refreshToken: string
}

export class OtpCodesDTO {
  token: string
  email: string
  expiry: number
}

export class OneTimePasswordDTO {
  otp: string
}

export class VerifyDTO extends EmailDTO {
  @IsString()
  otp: string
}
