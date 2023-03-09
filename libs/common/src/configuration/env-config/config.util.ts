import {LogWarn} from '@libs/common/utils/logger'
import * as activityLogs from '@libs/common/enums/activity-logs'
import {devConfig} from '@libs/common/configuration'

/**
 * Config utility will load env specific config and then secrets from Node env
 */

export class Config {
  static get<T = unknown>(parameter: string): T {
    // eslint-disable-next-line no-process-env
    const config = {...devConfig, ...process.env}
    const variable = config[parameter]
    if (!variable)
      LogWarn(activityLogs.EnvConfigFunctions.Get, activityLogs.EnvConfigActions.GetSecretFailed, {
        parameter,
      })

    return <T>variable
  }

  static getBool(key: string): boolean {
    const value = Config.get(key)

    return value === 'enabled'
  }
}
