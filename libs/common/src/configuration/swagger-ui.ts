import {SwaggerModule} from '@nestjs/swagger'
import {INestApplication} from '@nestjs/common'
import {LogWarn} from '@libs/common/utils/logger'
import * as activityLogs from '@libs/common/enums/activity-logs'
import {SwaggerConfiguration} from '@libs/common/configuration/index'
import {Config} from '@libs/common/configuration'

export const createSwagger = (app: INestApplication, appPrefix: string): void => {
  const isSwaggerEnabled = Config.get<string>('IS_SWAGGER_ENABLED')
  const authCredentials = Config.get<string>('SWAGGER_PASSWORD')
  const apiDocPath = `/${appPrefix}/api/doc/`

  if (isSwaggerEnabled !== 'enabled') {
    LogWarn(
      activityLogs.SwaggerActions.CreateSwagger,
      activityLogs.SwaggerActions.ISSwaggerEnabled,
      {message: activityLogs.SwaggerActions.SwaggerEnabledMessage},
    )
    return
  }

  if (!authCredentials) {
    LogWarn(
      activityLogs.SwaggerActions.CreateSwagger,
      activityLogs.SwaggerActions.AuthCredentials,
      {message: activityLogs.SwaggerActions.AuthCredentialsMessage},
    )
    return
  }

  const authParts = authCredentials.split(':')
  if (authParts.length != 2) {
    LogWarn(activityLogs.SwaggerActions.CreateSwagger, activityLogs.SwaggerActions.AuthParts, {
      message: activityLogs.SwaggerActions.CheckAuthPartsMessage,
    })
    return
  }

  const document = SwaggerModule.createDocument(app, SwaggerConfiguration)

  app.use((req, res, next) => {
    if ((req.originalUrl as string).startsWith(apiDocPath)) {
      const userPass = Buffer.from(
        (req.headers.authorization || '').split(' ')[1] || '',
        'base64',
      ).toString()

      if (userPass != authCredentials || !isSwaggerEnabled) {
        res.writeHead(401, {'WWW-Authenticate': 'Basic realm="nope"'})
        res.end('HTTP Error 401 Unauthorized: Access is denied')
      }
      return next()
    }

    return next()
  })
  SwaggerModule.setup(apiDocPath, app, document)
}
