import {ScraperAppConfig} from '@libs/common/server'
import {bootstrap} from '@libs/common/bootstrap'
import {ScraperApp} from './scraper.app.module'

const service = new ScraperAppConfig()

bootstrap({
  appModule: ScraperApp,
  port: service.port,
  prefix: service.prefix,
})
