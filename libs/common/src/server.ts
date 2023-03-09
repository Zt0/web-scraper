import {ServicePort, ServicePrefix} from '@libs/common/enums/service'
import {IAppConfig} from '@libs/common/interfaces/service'

export class UsersAppConfig implements IAppConfig {
  public port: number = ServicePort.Users
  public prefix: string = ServicePrefix.Users
}

export class ScraperAppConfig implements IAppConfig {
  public port: number = ServicePort.Scraper
  public prefix: string = ServicePrefix.Scraper
}
