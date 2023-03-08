import {Module} from '@nestjs/common'
import {TypeORMConfiguration} from '@libs/common/typeorm.config'

@Module({
  imports: [TypeORMConfiguration],
  providers: [],
  exports: [TypeORMConfiguration],
})
export class DataLayerModule {}
