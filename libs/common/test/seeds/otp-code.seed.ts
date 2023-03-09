import {DataSource, In, Repository} from 'typeorm'
import {OtpCodes} from '@libs/common/entities'
import {IFixtureCreator} from '@libs/common'
import {DateTimeUtil} from '@libs/common/utils/date-time-util'
import {activeOtpCode, expiredOtpCode} from '@libs/common/test/fixtures/otp-codes.fixture'
import {validEmailRefreshToken} from '@libs/common/test/fixtures/auth.fixture'

export class OtpCodeSeed implements IFixtureCreator<OtpCodes> {
  /** Common list for create and delete */
  dataToCreate: Partial<OtpCodes>[] = [expiredOtpCode, activeOtpCode]
  dataToRemove: Partial<OtpCodes>[] = []
  private readonly otpCodesRepository: Repository<OtpCodes>

  constructor(dataSource: DataSource) {
    this.otpCodesRepository = dataSource.getRepository(OtpCodes)
  }

  async createFixtures(): Promise<void> {
    const fixturesWithDefaultValues = this.dataToCreate.map((fixture) =>
      this.setDefaultValues(fixture),
    )
    await this.otpCodesRepository.save(fixturesWithDefaultValues)
  }

  async destroyFixtures(): Promise<void> {
    await this.removeByIds(this.dataToRemove.map(({id}) => id))
    await this.removeByEmail(validEmailRefreshToken)
  }

  async removeByIds(ids: number[]): Promise<void> {
    await this.otpCodesRepository.delete({id: In(ids)})
  }

  async removeByEmail(email: string): Promise<void> {
    await this.otpCodesRepository.delete({email})
  }

  private setDefaultValues(dataOverwrite: Partial<OtpCodes>): Partial<OtpCodes> {
    return {
      id: dataOverwrite.id,
      uuid: dataOverwrite.uuid,
      expiry: dataOverwrite.expiry ?? Number(DateTimeUtil.now()),
      token: dataOverwrite.token ?? 'SEED',
      email: dataOverwrite.email ?? 'SEED',
    }
  }
}
