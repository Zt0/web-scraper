import {Column, Entity, Generated, PrimaryGeneratedColumn} from 'typeorm'
import {Auditable} from '@libs/common/model/auditable'

@Entity('otp_codes')
export class OtpCodes extends Auditable {
  @PrimaryGeneratedColumn()
  id: number

  @Generated('uuid')
  @Column({type: 'varchar', unique: true})
  uuid: string

  @Column({type: 'int', nullable: true})
  token: string

  @Column({type: 'bigint'})
  expiry: number

  @Column({type: 'varchar'})
  email: string
}
