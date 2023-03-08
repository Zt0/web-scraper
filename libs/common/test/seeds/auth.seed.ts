import {DataSource, In, Repository} from 'typeorm'
import {Auth} from '@libs/common/entities'
import {IFixtureCreator} from '@libs/common'
import {authRefreshTokenFixture, validAuthEmail} from '@libs/common/test/fixtures/auth.fixture'
import {autoIncrement} from '@libs/common/test/utils/increment-id'

export class AuthSeed implements IFixtureCreator<Auth> {
  /** Common list for create and delete */
  dataToCreate: Partial<Auth>[] = [authRefreshTokenFixture]
  dataToRemove: Partial<Auth>[] = [authRefreshTokenFixture] //todo pass only ids, not the whole object?
  private uniqueEmail: () => number = autoIncrement()
  private authRepository: Repository<Auth>

  constructor(dataSource: DataSource) {
    this.authRepository = dataSource.getRepository(Auth)
  }

  async createFixtures(): Promise<void> {
    const fixturesWithDefaultValues = this.dataToCreate.map((fixture) =>
      this.setDefaultValues(fixture),
    )
    await this.authRepository.save(fixturesWithDefaultValues)
  }

  async destroyFixtures(): Promise<void> {
    await this.removeByIds(this.dataToRemove.map(({id}) => id))
    await this.removeByEmail(validAuthEmail)
  }

  async removeByIds(ids: number[]): Promise<void> {
    await this.authRepository.delete({id: In(ids)})
  }

  async removeByEmail(email: string): Promise<void> {
    await this.authRepository.delete({email})
  }

  private setDefaultValues(dataOverwrite: Partial<Auth>): Partial<Auth> {
    return {
      id: dataOverwrite.id,
      uuid: dataOverwrite.uuid,
      email: dataOverwrite.email ?? `seed${this.uniqueEmail()}@gmail.com`,
      password: dataOverwrite.password ?? 'seedPa55w()rd',
    }
  }
}
