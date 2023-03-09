import {ExtractJwt, Strategy} from 'passport-jwt'
import {PassportStrategy} from '@nestjs/passport'
import {Injectable} from '@nestjs/common'
import {Config} from '@libs/common/configuration'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    })
  }

  async validate(payload: unknown): Promise<unknown> {
    return {payload}
  }
}
