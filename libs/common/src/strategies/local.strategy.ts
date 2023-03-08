import {Strategy} from 'passport-local'
import {PassportStrategy} from '@nestjs/passport'
import {Injectable} from '@nestjs/common'
import {AuthService} from '@apps/users/auth/services/auth.service'
import {AuthResponseDTO} from '@libs/common'
import {UnauthorizedException} from '@libs/common/exceptions'
import {INVALID_EMAIL_OR_PASSWORD} from '@libs/common/errors'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    })
  }

  async validate(email: string, password: string): Promise<AuthResponseDTO> {
    const authResponseDTO = await this.authService.validateCredentials({
      email,
      password,
    })
    if (!authResponseDTO) throw new UnauthorizedException(INVALID_EMAIL_OR_PASSWORD)
    return authResponseDTO
  }
}
