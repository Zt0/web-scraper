import {Module} from '@nestjs/common'
import {CommonModule, DataLayerModule} from '@libs/common'
import {AuthRepository, UserRepository} from '@libs/common/repositories'
import {UserController} from '@apps/users/user/user.controller'
import {UserService} from '@apps/users/user/services/user.service'
import {AuthService} from '@apps/users/auth/services/auth.service'
import {JwtService} from '@nestjs/jwt'

@Module({
  imports: [DataLayerModule, CommonModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, AuthService, AuthRepository, JwtService],
})
export class UserModule {}
