import {Column, Entity, Generated, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm'
import {Auditable} from '@libs/common/model/auditable'
import {Auth} from '@libs/common/entities'
import {Gender} from '@libs/common/enums/user'

@Entity('user')
export class User extends Auditable {
  @PrimaryGeneratedColumn()
  id: number

  @Generated('uuid')
  @Column({type: 'varchar', unique: true})
  uuid: string

  @Column({type: 'int', unique: true})
  authId: number

  @Column({type: 'varchar'})
  firstName: string

  @Column({type: 'varchar'})
  lastName: string

  @Column({type: 'varchar', nullable: true})
  middleName?: string

  @Column({type: 'date'})
  dateOfBirth: Date

  @Column({type: 'enum', enum: Gender})
  gender: Gender

  @Column({type: 'varchar'})
  address: string

  @Column({type: 'varchar'})
  description: string

  @OneToOne(() => Auth, (auth) => auth.id)
  @JoinColumn({name: 'authId'})
  auth: Auth
}
