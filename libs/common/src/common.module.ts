import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {JwtModule} from '@nestjs/jwt'
import {Config} from '@libs/common/configuration'
import {APP_INTERCEPTOR} from '@nestjs/core'
import {ResetPasswordInterceptor} from '@libs/common/interceptors/reset-password.inteceptor'
import {AuthRepository} from '@libs/common/repositories'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: Config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      signOptions: {expiresIn: Config.get<string>('ACCESS_TOKEN_DURATION')},
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResetPasswordInterceptor,
    },
    AuthRepository,
  ],
  exports: [],
})
export class CommonModule {}
