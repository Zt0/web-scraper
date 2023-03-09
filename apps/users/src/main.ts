import {UsersAppConfig} from '@libs/common/server'
import {bootstrap} from '@libs/common/bootstrap'
import {UsersApp} from '@apps/users/users.app.module'

const service = new UsersAppConfig()

bootstrap({
  appModule: UsersApp,
  port: service.port,
  prefix: service.prefix,
})
