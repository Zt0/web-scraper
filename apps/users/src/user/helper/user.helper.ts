import {User} from '@libs/common'
import {UserDTO} from '@libs/common/dto/user.dto'

export function getUserDTO(user: User): UserDTO {
  return {
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    address: user.address,
    description: user.description,
  }
}
