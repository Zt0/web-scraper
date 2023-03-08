import {Injectable} from '@nestjs/common'
import {AuthRepository, OtpCodesRepository, UserRepository} from '@libs/common/repositories'
import {JwtService} from '@nestjs/jwt'
import {Cron, CronExpression} from '@nestjs/schedule'
import {LessThanOrEqual} from 'typeorm'
import {MailerService} from '@nestjs-modules/mailer'
import {
  AccessTokenDTO,
  AuthResponseDTO,
  LogInDTO,
  OtpCodesDTO,
  RegisterDTO,
  TokensDTO,
  VerifyOtpTokenDTO,
} from '@libs/common'
import * as activityLogs from '@libs/common/enums/activity-logs'
import {LogError, LogInfo} from '@libs/common/utils'
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@libs/common/exceptions'
import {
  AUTH_NOT_FOUND,
  FORGOT_PASSWORD,
  INVALID_OTP,
  INVALID_REFRESH_TOKEN,
  LOG_IN,
  OLD_PASSWORD,
  REFRESH_TOKEN,
  REGISTER,
  REMOVE_EXPIRED_OTPS,
  RESET_PASSWORD,
  SEND_EMAIL,
  USER_NOT_FOUND,
  VALIDATE_CREDENTIALS,
  VERIFY_OTP,
} from '@libs/common/errors'
import {Config} from '@libs/common/configuration'
import {handleError} from '@libs/common/error-handling'
import {
  compareWithEncrypted,
  generateOTP,
  hash,
  invalidOTP,
  otpCodeDTO,
} from '@apps/users/auth/helper/auth.helper'
import {DateTimeUtil} from '@libs/common/utils/date-time-util'

@Injectable()
export class AuthService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly otpCodesRepository: OtpCodesRepository,
  ) {}

  async validateCredentials(logInDTO: LogInDTO): Promise<AuthResponseDTO> {
    try {
      const {email, password} = logInDTO
      const auth = await this.authRepository.findOneByEmail(email)
      if (!auth) throw new NotFoundException(AUTH_NOT_FOUND)
      const {password: encryptedPassword, uuid} = auth
      const validPass = await compareWithEncrypted(password, encryptedPassword)
      return auth && validPass ? {uuid} : null
    } catch (error) {
      LogError(
        activityLogs.AuthServiceFunctions.ValidateUser,
        activityLogs.AuthServiceActions.Failed,
        {logInDTO, error},
      )
      handleError(error)
      throw new InternalServerErrorException(VALIDATE_CREDENTIALS)
    }
  }

  async register(registerDTO: RegisterDTO): Promise<void> {
    try {
      registerDTO.password = await hash(registerDTO.password)
      await this.authRepository.insert(registerDTO)
    } catch (error) {
      LogError(activityLogs.AuthServiceFunctions.Register, activityLogs.AuthServiceActions.Failed, {
        error,
      })
      handleError(error)
      throw new InternalServerErrorException(REGISTER)
    }
  }

  async login(email: string): Promise<TokensDTO> {
    try {
      const {uuid} = await this.authRepository.findOneByEmail(email)
      const accessToken = this.jwtService.sign({uuid})
      const refreshToken = this.jwtService.sign(
        {uuid},
        {
          expiresIn: Config.get<string>('REFRESH_TOKEN_DURATION'),
          secret: Config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        },
      )
      return {
        accessToken,
        refreshToken,
      }
    } catch (error) {
      LogError(activityLogs.AuthServiceFunctions.LogIn, activityLogs.AuthServiceActions.Failed, {
        email,
        error,
      })
      handleError(error)
      throw new InternalServerErrorException(LOG_IN)
    }
  }

  async refreshToken(refreshToken: string): Promise<AccessTokenDTO> {
    try {
      const {uuid} = this.jwtService.verify(refreshToken, {
        secret: Config.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      })
      const authExists = await this.authRepository.exist({where: {uuid}})
      if (authExists) {
        return {accessToken: this.jwtService.sign({uuid})}
      } else throw new UnauthorizedException(INVALID_REFRESH_TOKEN)
    } catch (error) {
      LogError(
        activityLogs.AuthServiceFunctions.RefreshToken,
        activityLogs.AuthServiceActions.Failed,
        {error},
      )
      handleError(error)
      throw new InternalServerErrorException(REFRESH_TOKEN)
    }
  }

  async forgotPassword(email: string): Promise<string> {
    try {
      const user = await this.userRepository.exist({
        //todo if forgot password will execute after user creation (not auth creation), it will be fine, but otherwise no
        where: {auth: {email}},
        relations: {auth: true},
      })
      if (!user) throw new NotFoundException(USER_NOT_FOUND)
      const token = generateOTP()
      const otpCodesDTO: OtpCodesDTO = otpCodeDTO(token, email)
      await this.otpCodesRepository.insert(otpCodesDTO)
      await this.sendMail(email, token)
      return token
    } catch (error) {
      LogError(
        activityLogs.AuthServiceFunctions.ForgotPassword,
        activityLogs.AuthServiceActions.Failed,
        {
          error,
        },
      )
      handleError(error)
      /* istanbul ignore next */
      throw new InternalServerErrorException(FORGOT_PASSWORD)
    }
  }

  async verifyOTP(email: string, otp: string): Promise<VerifyOtpTokenDTO> {
    try {
      const otpCode = await this.otpCodesRepository.findOneByEmailAndToken(email, otp)
      if (invalidOTP(otpCode)) throw new BadRequestException(INVALID_OTP)
      const verifyOtpToken = this.jwtService.sign(
        {email},
        {
          expiresIn: Config.get<string>('VERIFY_OTP_TOKEN_DURATION'),
          secret: Config.get<string>('JWT_VERIFY_OTP_TOKEN_SECRET'),
        },
      )
      return {verifyOtpToken}
    } catch (error) {
      LogError(
        activityLogs.AuthServiceFunctions.VerifyOTP,
        activityLogs.AuthServiceActions.Failed,
        {
          error,
        },
      )
      handleError(error)
      throw new InternalServerErrorException(VERIFY_OTP)
    }
  }

  async resetPassword(email: string, password: string): Promise<void> {
    try {
      const hashedPassword = await hash(password)
      const oldPassword = await this.authRepository.exist({
        where: {email, password: hashedPassword},
      })
      if (oldPassword) throw new BadRequestException(OLD_PASSWORD)
      await this.authRepository.update({email}, {password: hashedPassword})
    } catch (error) {
      LogError(
        activityLogs.AuthServiceFunctions.ResetPassword,
        activityLogs.AuthServiceActions.Failed,
        {
          error,
        },
      )
      handleError(error)
      throw new InternalServerErrorException(RESET_PASSWORD)
    }
  }

  /* istanbul ignore next */
  @Cron(CronExpression.EVERY_WEEK)
  async removeExpiredOTPs(): Promise<void> {
    try {
      await this.otpCodesRepository.delete({
        expiry: LessThanOrEqual(Number(DateTimeUtil.now())),
      })
    } catch (error) {
      LogError(
        activityLogs.AuthServiceFunctions.RemoveExpiredOTPs,
        activityLogs.AuthServiceActions.Failed,
        {
          error,
        },
      )
      handleError(error)
      throw new InternalServerErrorException(REMOVE_EXPIRED_OTPS)
    }
  }

  private async sendMail(email: string, token: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: Config.get('EMAIL_SENDER'),
        subject: 'OTP code',
        context: {token},
        template: __dirname + '/templates/otp.ejs',
      })
      LogInfo(activityLogs.AuthServiceFunctions.SendOTP, activityLogs.AuthServiceActions.Succeed, {
        email,
      })
    } catch (error) {
      LogError(activityLogs.AuthServiceFunctions.SendOTP, activityLogs.AuthServiceActions.Failed, {
        error,
        email,
      })
      handleError(error)
      throw new InternalServerErrorException(SEND_EMAIL)
    }
  }
}
