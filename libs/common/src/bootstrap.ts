// import cookie, {FastifyCookieOptions} from '@fastify/cookie'
import {NestFactory} from '@nestjs/core'
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify'
import {INestApplication, ValidationError, ValidationPipe} from '@nestjs/common'
import {asyncStorage, createRequestContext} from '@libs/common/async-hook'
import {DtoValidationException} from '@libs/common/exceptions/dto-validation.exception'
import {AllExceptionsFilter} from '@libs/common/exception-filters/all-exceptions.filter'
import {createSwagger} from '@libs/common/configuration/swagger-ui'
import {Config} from '@libs/common/configuration'
import {IBootstrapApplicationConfig} from '@libs/common/interfaces/bootstrap'

export async function bootstrap(config: IBootstrapApplicationConfig): Promise<INestApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    config.appModule,
    new FastifyAdapter(),
  )

  if (config.prefix) {
    app.setGlobalPrefix(config.prefix)
  }

  createSwagger(app, config.prefix)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (errors: ValidationError[]): DtoValidationException =>
        new DtoValidationException(errors),
    }),
  )

  app.useGlobalFilters(new AllExceptionsFilter(config.isDevelopment))
  if (Config.getBool('FEATURE_ASYNC_LOCAL_STORAGE')) {
    app.use((_, __, next) => {
      const requestMetadata = createRequestContext()
      asyncStorage.run(requestMetadata, () => next())
    })
  }

  const corsDomains = Config.get<string[]>('CORS_DOMAINS')
  if (Boolean(corsDomains.length)) {
    app.enableCors({origin: corsDomains})
  }
  await app.listen(config.port)
  return app
}
