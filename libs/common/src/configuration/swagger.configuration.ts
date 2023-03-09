import {DocumentBuilder} from '@nestjs/swagger'

export const SwaggerConfiguration = new DocumentBuilder()
  .setTitle('BEP')
  .setVersion('1.0')
  .addBearerAuth()
  .build()
