import {Body, Controller, HttpCode, HttpStatus, Post, Req, UseInterceptors} from '@nestjs/common'
import {ApiResponse, ApiTags} from '@nestjs/swagger'
import {ResponseWrapper} from '@libs/common/dto/response-wrapper.dto'
import {Response} from '@libs/common/dto/response-status.dto'
import {RequestWithUUID} from '@libs/common/types/request'
import {AuthInterceptor} from '@libs/common/interceptors/auth-interceptor.service'
import {ScraperService} from './services/scraper.service'
import {UrlDTO} from '@libs/common/dto/scraper.dto'

@ApiTags('Scraper')
@Controller('v1/scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({type: Response})
  @UseInterceptors(AuthInterceptor)
  async createUser(@Body() {url}: UrlDTO, @Req() req: RequestWithUUID): Promise<Response> {
    await this.scraperService.scrapeData(url, req.uuid)
    return ResponseWrapper.actionSucceed()
  }
}
