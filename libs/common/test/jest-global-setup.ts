import 'tsconfig-paths/register'
import {DBConnection} from '@libs/common/typeorm/connection'
import {testSqlConnection} from '@libs/common/test/test-connection'
import teardown from './jest-global-teardown'
import {AuthSeed, UserSeed} from '@libs/common/test/seeds'
import {OtpCodeSeed} from '@libs/common/test/seeds/otp-code.seed'

/**
 * Function runs before any test suite
 */
export default async (): Promise<void> => {
  await teardown()
  await testSqlConnection()

  const connection = await DBConnection()

  const authSeed = new AuthSeed(connection)
  const userSeed = new UserSeed(connection)
  const otpCodeSeed = new OtpCodeSeed(connection)
  // Create fixtures without Foreign Keys
  await Promise.all([otpCodeSeed.createFixtures()])
  // Create fixtures with FKs

  await authSeed.createFixtures()
  await userSeed.createFixtures()

  await connection.destroy()
}
