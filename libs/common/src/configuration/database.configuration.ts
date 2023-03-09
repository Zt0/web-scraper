import {TypeOrmModule} from '@nestjs/typeorm'
import {DynamicModule} from '@nestjs/common'
import {CommonModule} from '@libs/common'
import {Config} from '@libs/common/configuration'
import {DBMS, LogLevels} from '@libs/common/enums'

export const DefaultDatabaseConfiguration = (): DynamicModule => {
  return TypeOrmModule.forRootAsync({
    imports: [CommonModule],
    useFactory: () => ({
      host: Config.get<string>('DB_SQL_LOCAL_HOST'),
      port: Config.get<number>('DB_SQL_LOCAL_PORT'),
      type: DBMS.Mysql,
      database: Config.get<string>('DB_SQL_NAME'),
      username: Config.get<string>('DB_SQL_USERNAME'),
      password: Config.get<string>('DB_SQL_PASSWORD'),
      synchronize: true,
      migrationsRun: false,
      subscribers: [],
      logging: [LogLevels.Warn, LogLevels.Error],
      autoLoadEntities: true,
      retryAttempts: 4,
      retryDelay: 3000,
      keepConnectionAlive: false,
    }),
  })
}
