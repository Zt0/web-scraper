import {Module} from '@nestjs/common'
import {ScraperController} from './scraper.controller'
import {JwtService} from '@nestjs/jwt'
import {ScraperService} from './services/scraper.service'

@Module({
  imports: [],
  controllers: [ScraperController],
  providers: [ScraperService, JwtService],
})
export class ScraperModule {}
