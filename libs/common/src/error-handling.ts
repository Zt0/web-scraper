import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@libs/common/exceptions'

export const handleError = (error: Error): void => {
  [
    InternalServerErrorException,
    BadRequestException,
    UnauthorizedException,
    NotFoundException,
  ].forEach((e) => {
    if (error instanceof e) throw error
  })
}
