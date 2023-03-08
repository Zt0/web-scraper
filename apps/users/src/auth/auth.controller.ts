import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {ApiResponse, ApiTags} from '@nestjs/swagger'
import {LocalAuthGuard} from '@libs/common/guards/local-auth.guard'
import {ResetPasswordInterceptor} from '@libs/common/interceptors/reset-password.inteceptor'
import {AuthService} from '@apps/users/auth/services/auth.service'
import {
  AccessTokenDTO,
  AuthResponseDTO,
  EmailDTO,
  LogInDTO,
  OneTimePasswordDTO,
  PasswordDTO,
  RefreshTokenDTO,
  RegisterDTO,
  TokensDTO,
  VerifyDTO,
  VerifyOtpTokenDTO,
} from '@libs/common/dto/auth.dto'
import {ResponseWrapper} from '@libs/common/dto/response-wrapper.dto'
import {Response} from '@libs/common/dto/response-status.dto'
import {RequestWithEmail} from '@libs/common/types/request'

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({type: AuthResponseDTO})
  async register(@Body() registerDTO: RegisterDTO): Promise<void> {
    await this.authService.register(registerDTO)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({type: TokensDTO})
  @UseGuards(LocalAuthGuard)
  async login(@Body() {email}: LogInDTO): Promise<ResponseWrapper<TokensDTO>> {
    const tokens = await this.authService.login(email)
    return ResponseWrapper.actionSucceed(tokens)
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({type: AccessTokenDTO})
  async refreshToken(
    @Body() {refreshToken}: RefreshTokenDTO,
  ): Promise<ResponseWrapper<AccessTokenDTO>> {
    const accessToken = await this.authService.refreshToken(refreshToken)
    return ResponseWrapper.actionSucceed(accessToken)
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({type: OneTimePasswordDTO})
  async forgotPassword(@Body() {email}: EmailDTO): Promise<ResponseWrapper<OneTimePasswordDTO>> {
    const otp = await this.authService.forgotPassword(email)
    return ResponseWrapper.actionSucceed({otp})
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  // @Recaptcha() //todo
  @ApiResponse({type: VerifyOtpTokenDTO})
  async verifyOTP(@Body() {email, otp}: VerifyDTO): Promise<ResponseWrapper<VerifyOtpTokenDTO>> {
    const verifyOtpToken = await this.authService.verifyOTP(email, otp)
    return ResponseWrapper.actionSucceed(verifyOtpToken)
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ResetPasswordInterceptor)
  @ApiResponse({type: Response})
  async resetPassword(
    @Body() {password}: PasswordDTO,
    @Req() req: RequestWithEmail,
  ): Promise<ResponseWrapper<Response>> {
    await this.authService.resetPassword(req.email, password)
    return ResponseWrapper.actionSucceed()
  }

  @Post('remove-expired-otps')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({type: Response})
  async removeExpiredOTPs(): Promise<ResponseWrapper<Response>> {
    await this.authService.removeExpiredOTPs()
    return ResponseWrapper.actionSucceed()
  }
}
