import {DataSource, In, Repository} from 'typeorm'
import {User} from '@libs/common/entities'
import {IFixtureCreator} from '@libs/common'
import {authRefreshTokenFixture} from '@libs/common/test/fixtures/auth.fixture'
import {Gender} from '@libs/common/enums/user'
import {DateTimeUtil} from '@libs/common/utils/date-time-util'

export class UserSeed implements IFixtureCreator<User> {
  /** Common list for create and delete */
  dataToCreate: Partial<User>[] = []
  dataToRemove: Partial<User>[] = []
  private authRepository: Repository<User>

  constructor(public dataSource: DataSource) {
    this.authRepository = dataSource.getRepository(User)
  }

  async createFixtures(): Promise<void> {
    const fixturesWithDefaultValues = this.dataToCreate.map((fixture) =>
      this.setDefaultValues(fixture),
    )
    await this.authRepository.save(fixturesWithDefaultValues)
  }

  async destroyFixtures(): Promise<void> {
    await this.removeByIds(this.dataToRemove.map(({id}) => id))
    await this.removeByUUIDs([authRefreshTokenFixture.uuid])
  }

  async removeByIds(ids: number[]): Promise<void> {
    await this.authRepository.delete({id: In(ids)})
  }

  async removeByUUIDs(uuids: string[]): Promise<void> {
    await this.authRepository.delete({uuid: In(uuids)})
  }

  private setDefaultValues(dataOverwrite: Partial<User>): Partial<User> {
    return {
      id: dataOverwrite.id,
      uuid: dataOverwrite.uuid,
      firstName: dataOverwrite.firstName ?? 'SEED',
      lastName: dataOverwrite.lastName ?? 'SEED',
      middleName: dataOverwrite.middleName ?? 'SEED',
      dateOfBirth: dataOverwrite.dateOfBirth ?? DateTimeUtil.toDate('1970-12-12'),
      gender: dataOverwrite.gender ?? Gender.Other,
      address: dataOverwrite.address ?? 'SEED',
      description: dataOverwrite.description ?? 'SEED',
    }
  }
}
