import {Injectable} from '@nestjs/common'
import {DataSource, Repository} from 'typeorm'
import {User} from '@libs/common'
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity'
import {InsertResult} from 'typeorm/query-builder/result/InsertResult'
import {FindOptionsWhere} from 'typeorm/find-options/FindOptionsWhere'
import {UpdateResult} from 'typeorm/query-builder/result/UpdateResult'
import {DeleteResult} from 'typeorm/query-builder/result/DeleteResult'
import {FindManyOptions} from 'typeorm/find-options/FindManyOptions'

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(public readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }

  override insert(
    entity: QueryDeepPartialEntity<User> | QueryDeepPartialEntity<User>[],
  ): Promise<InsertResult> {
    return super.insert(entity)
  }

  override update(
    criteria: FindOptionsWhere<User>,
    partialEntity: QueryDeepPartialEntity<User>,
  ): Promise<UpdateResult> {
    return super.update(criteria, partialEntity)
  }

  override exist(options?: FindManyOptions<User>): Promise<boolean> {
    return super.exist(options)
  }

  override delete(criteria: FindOptionsWhere<User>): Promise<DeleteResult> {
    return super.delete(criteria)
  }

  findOneByUuid(uuid: string): Promise<User> {
    return this.findOne({where: {uuid}})
  }
}
