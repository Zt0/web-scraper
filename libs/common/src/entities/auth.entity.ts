import {Column, Entity, Generated, PrimaryGeneratedColumn} from 'typeorm'
import {Auditable} from '@libs/common/model/auditable'

@Entity('auth')
export class Auth extends Auditable {
  @PrimaryGeneratedColumn()
  id: number

  @Generated('uuid')
  @Column({type: 'varchar', unique: true})
  uuid: string

  @Column({type: 'varchar', unique: true})
  email: string

  @Column({type: 'varchar'})
  password: string
}
