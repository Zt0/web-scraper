/* eslint-disable no-console */
import {DataSource} from 'typeorm'
import {DataSourceOptions} from 'typeorm/data-source/DataSourceOptions'

import {Config} from '@libs/common/configuration'
import {DBMS, LogLevels} from '@libs/common/enums'
import * as activityLogs from '@libs/common/enums/activity-logs'
import {LogError, LogInfo, LogWarn} from '@libs/common/utils'
import {entities} from '@libs/common'

export const DBConnection = async (): Promise<DataSource> => {
  let dataSource

  if (!dataSource?.isInitialized) {
    LogWarn(
      activityLogs.ConnectionFunctions.DBConnection,
      activityLogs.ConnectionActions.ExistingDBConnectionNotConnected,
      {isInitialized: dataSource?.isInitialized},
    )
  }

  try {
    const config = {
      host: Config.get<string>('DB_SQL_LOCAL_HOST'),
      port: Config.get<number>('DB_SQL_LOCAL_PORT'),
      type: DBMS.Mysql,
      database: Config.get<string>('DB_SQL_NAME'),
      username: Config.get<string>('DB_SQL_USERNAME'),
      password: Config.get<string>('DB_SQL_PASSWORD'),
      entities: entities,
      synchronize: true,
      logging: [LogLevels.Warn, LogLevels.Error],
    } as DataSourceOptions

    dataSource = await new DataSource(config).initialize()
    LogInfo(
      activityLogs.ConnectionFunctions.DBConnection,
      activityLogs.ConnectionActions.Established,
      {dbms: DBMS.Mysql},
    )
  } catch (error) {
    LogError(activityLogs.ConnectionFunctions.DBConnection, activityLogs.ConnectionActions.Failed, {
      error,
    })
  }
  return dataSource
}
