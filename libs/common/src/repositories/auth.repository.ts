import {Injectable} from '@nestjs/common'
import {DataSource, Repository} from 'typeorm'
import {Auth} from '@libs/common/entities'
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity'
import {InsertResult} from 'typeorm/query-builder/result/InsertResult'
import {FindOptionsWhere} from 'typeorm/find-options/FindOptionsWhere'
import {UpdateResult} from 'typeorm/query-builder/result/UpdateResult'
import {FindManyOptions} from 'typeorm/find-options/FindManyOptions'

@Injectable()
export class AuthRepository extends Repository<Auth> {
  constructor(public readonly dataSource: DataSource) {
    super(Auth, dataSource.createEntityManager())
  }

  override insert(
    entity: QueryDeepPartialEntity<Auth> | QueryDeepPartialEntity<Auth>[],
  ): Promise<InsertResult> {
    return super.insert(entity)
  }

  override update(
    criteria: FindOptionsWhere<Auth>,
    partialEntity: QueryDeepPartialEntity<Auth>,
  ): Promise<UpdateResult> {
    return super.update(criteria, partialEntity)
  }

  override exist(options?: FindManyOptions<Auth>): Promise<boolean> {
    return super.exist(options)
  }

  findOneByEmail(email: string): Promise<Auth> {
    return this.findOne({where: {email}})
  }

  findOneByUuid(uuid: string): Promise<Auth> {
    return this.findOne({where: {uuid}})
  }
}
