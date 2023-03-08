import {Injectable} from '@nestjs/common'
import * as activityLogs from '@libs/common/enums/activity-logs'
import {LogError} from '@libs/common/utils'
import {BadRequestException, NotFoundException} from '@libs/common/exceptions'
import {AUTH_NOT_FOUND, CREATE, GET, UPDATE, USER_NOT_FOUND} from '@libs/common/errors'
import {handleError} from '@libs/common/error-handling'
import {UserDTO} from '@libs/common/dto/user.dto'
import {AuthRepository, UserRepository} from '@libs/common/repositories'
import {getUserDTO} from '@apps/users/user/helper/user.helper'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async getUser(uuid: string): Promise<UserDTO> {
    try {
      const user = await this.userRepository.findOneByUuid(uuid)
      if (!user) throw new NotFoundException(USER_NOT_FOUND)
      return getUserDTO(user)
    } catch (error) {
      LogError(activityLogs.UserServiceFunctions.Get, activityLogs.UserServiceActions.Failed, {
        error,
      })
      handleError(error)
      throw new BadRequestException(GET)
    }
  }

  async createUser(userDTO: UserDTO, uuid: string): Promise<void> {
    try {
      const auth = await this.authRepository.findOneByUuid(uuid)
      if (!auth) throw new NotFoundException(AUTH_NOT_FOUND)
      await this.userRepository.insert({...userDTO, uuid, authId: auth.id})
    } catch (error) {
      LogError(activityLogs.UserServiceFunctions.Create, activityLogs.UserServiceActions.Failed, {
        error,
      })
      handleError(error)
      throw new BadRequestException(CREATE)
    }
  }

  async updateUser(userDTO: Partial<UserDTO>, uuid: string): Promise<void> {
    try {
      await this.userRepository.update({uuid: uuid}, {...userDTO})
    } catch (error) {
      LogError(activityLogs.UserServiceFunctions.Update, activityLogs.UserServiceActions.Failed, {
        error,
      })
      handleError(error)
      throw new BadRequestException(UPDATE)
    }
  }
}
