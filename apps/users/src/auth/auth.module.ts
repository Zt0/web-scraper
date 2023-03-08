import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {ScheduleModule} from '@nestjs/schedule'
import {MailerModule} from '@nestjs-modules/mailer'
import {CommonModule, DataLayerModule} from '@libs/common'
import {AuthController} from './auth.controller'
import {AuthService} from './services/auth.service'
import {PassportModule} from '@nestjs/passport'
import {Config} from '@libs/common/configuration'
import {EjsAdapter} from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import {LocalStrategy} from '@libs/common/strategies/local.strategy'
import {AuthRepository, OtpCodesRepository, UserRepository} from '@libs/common/repositories'
import {JwtStrategy} from '@libs/common/strategies/jwt.strategy'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CommonModule,
    JwtModule.register({
      secret: Config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      signOptions: {expiresIn: Config.get<string>('ACCESS_TOKEN_DURATION')},
    }),
    DataLayerModule,
    PassportModule,
    MailerModule.forRoot({
      transport: {
        host: Config.get('SMTP_HOST'),
        auth: {
          user: Config.get('SMTP_API_KEY'),
          pass: Config.get('MAILER_SERVICE_API_KEY'),
        },
      },
      template: {
        adapter: new EjsAdapter(),
        options: {strict: false},
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserRepository,
    AuthRepository,
    OtpCodesRepository,
  ],
})
export class AuthModule {}
