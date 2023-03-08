import {CustomDecorator, SetMetadata} from '@nestjs/common'
import {Roles} from '@libs/common/enums'

export const ROLES_KEY = 'roles'
export const Role = (...roles: Roles[]): CustomDecorator => SetMetadata(ROLES_KEY, roles)
