import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common'
import {Observable} from 'rxjs'
import {JwtService} from '@nestjs/jwt'
import {Config} from '@libs/common/configuration'

@Injectable()
export class ResetPasswordInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const token = context.switchToHttp().getRequest().headers.authorization.split(' ')[1]
    const {email} = this.jwtService.verify(token, {
      secret: Config.get('JWT_VERIFY_OTP_TOKEN_SECRET'),
    })
    const req = context.switchToHttp().getRequest()
    req.email = email

    return next.handle().pipe()
  }
}
