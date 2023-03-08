import {Injectable} from '@nestjs/common'
import {DataSource, Repository} from 'typeorm'
import {OtpCodes} from '@libs/common/entities/otp-codes.entity'
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity'
import {InsertResult} from 'typeorm/query-builder/result/InsertResult'

@Injectable()
export class OtpCodesRepository extends Repository<OtpCodes> {
  constructor(public readonly dataSource: DataSource) {
    super(OtpCodes, dataSource.createEntityManager())
  }

  override insert(
    entity: QueryDeepPartialEntity<OtpCodes> | QueryDeepPartialEntity<OtpCodes>[],
  ): Promise<InsertResult> {
    return super.insert(entity)
  }

  findOneByEmailAndToken(email: string, token: string): Promise<OtpCodes> {
    return this.findOne({where: {email, token}})
  }
}
