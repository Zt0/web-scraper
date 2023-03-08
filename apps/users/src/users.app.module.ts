import {Module} from '@nestjs/common'
import {CommonModule, DataLayerModule} from '@libs/common'
import {AuthModule} from '@apps/users/auth/auth.module'
import {DefaultDatabaseConfiguration} from '@libs/common/configuration/database.configuration'
import {UserModule} from '@apps/users/user/user.module'

@Module({
  imports: [AuthModule, UserModule, CommonModule, DataLayerModule, DefaultDatabaseConfiguration()],
  controllers: [],
  providers: [],
})
export class UsersApp {}
