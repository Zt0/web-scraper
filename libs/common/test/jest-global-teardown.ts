/**
 * Function runs after all test suite
 */
import {DBConnection} from '@libs/common/typeorm/connection'
import {AuthSeed, UserSeed} from '@libs/common/test/seeds'
import {OtpCodeSeed} from '@libs/common/test/seeds/otp-code.seed'

export default async (): Promise<void> => {
  const connection = await DBConnection()

  const authSeed = new AuthSeed(connection)
  const userSeed = new UserSeed(connection)
  const otpCodeSeed = new OtpCodeSeed(connection)

  // Remove fixtures without Foreign Keys
  await Promise.all([otpCodeSeed.destroyFixtures()])

  // Remove fixtures with FKs
  await userSeed.destroyFixtures()
  await authSeed.destroyFixtures()

  await connection.destroy()
}
