import {Module} from '@nestjs/common'
import {ConfigModule} from '@nestjs/config'
import {JwtModule} from '@nestjs/jwt'
import {Config} from '@libs/common/configuration'

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
  providers: [],
  exports: [],
})
export class CommonModule {}
