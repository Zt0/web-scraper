import {Injectable} from '@nestjs/common'
import * as activityLogs from '@libs/common/enums/activity-logs'
import {LogError} from '@libs/common/utils'
import {InternalServerErrorException} from '@libs/common/exceptions'
import {REGISTER} from '@libs/common/errors'
import {handleError} from '@libs/common/error-handling'

@Injectable()
export class ScraperService {
  constructor() {}

  async scrapeData(url: string, uuid: string): Promise<void> {
    try {
      console.log(url, uuid)
    } catch (error) {
      LogError(activityLogs.AuthServiceFunctions.Register, activityLogs.AuthServiceActions.Failed, {
        error,
      })
      handleError(error)
      throw new InternalServerErrorException(REGISTER)
    }
  }
}
