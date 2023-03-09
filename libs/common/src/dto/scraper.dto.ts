import {IsUrl} from 'class-validator'

export class UrlDTO {
  @IsUrl()
  url: string
}
