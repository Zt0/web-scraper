import {Module} from '@nestjs/common'
import {CommonModule, DataLayerModule} from '@libs/common'
import {DefaultDatabaseConfiguration} from '@libs/common/configuration/database.configuration'
import {ScraperModule} from './scraper/scraper.module'

@Module({
  imports: [ScraperModule, CommonModule, DataLayerModule, DefaultDatabaseConfiguration()],
  controllers: [],
  providers: [],
})
export class ScraperApp {}
