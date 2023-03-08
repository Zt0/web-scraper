import {DataSource, DataSourceOptions} from 'typeorm'
import {Config} from '@libs/common/configuration'
import * as activityLogs from '@libs/common/enums/activity-logs'
import {DBMS, LogLevels} from '@libs/common/enums'
import {LogError} from '@libs/common/utils'

export const testSqlConnection = async (): Promise<void> => {
  let dataSource

  try {
    const config = {
      host: Config.get<string>('DB_SQL_LOCAL_HOST'),
      port: Config.get<number>('DB_SQL_LOCAL_PORT'),
      type: DBMS.Mysql,
      database: Config.get<string>('DB_SQL_NAME'),
      username: Config.get<string>('DB_SQL_USERNAME'),
      password: Config.get<string>('DB_SQL_PASSWORD'),
      logging: [LogLevels.Warn, LogLevels.Error],
    } as DataSourceOptions

    dataSource = await new DataSource(config).initialize()
  } catch (error) {
    LogError(
      activityLogs.ConnectionFunctions.DBConnection,
      activityLogs.ConnectionActions.ExistingDBConnectionNotConnected,
      error,
    )
    throw error
  }

  await dataSource.destroy()
}
