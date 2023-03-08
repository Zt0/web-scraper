import {Gender} from '@libs/common/enums/user'
import {IsDateString, IsEnum, IsString} from 'class-validator'

export class UserDTO {
  @IsString()
  firstName: string

  @IsString()
  middleName: string

  @IsString()
  lastName: string

  @IsDateString()
  dateOfBirth: Date

  @IsEnum(Gender)
  gender: Gender

  @IsString()
  address: string

  @IsString()
  description: string
}
