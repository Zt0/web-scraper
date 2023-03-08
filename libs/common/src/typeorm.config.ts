import {TypeOrmModule} from '@nestjs/typeorm'
import {Auth, OtpCodes, User} from '@libs/common/entities'
import {AuthRepository, OtpCodesRepository, UserRepository} from '@libs/common/repositories'

export const entities = [User, Auth, OtpCodes]
export const repositories = [UserRepository, AuthRepository, OtpCodesRepository]

export const TypeORMConfiguration = TypeOrmModule.forFeature([...repositories, ...entities])
