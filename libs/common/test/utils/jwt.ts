import {JWTData} from '@libs/common/interfaces/auth'
import {authRefreshTokenId} from '@libs/common/test/ids/auth-ids'
import {uuid} from '@libs/common/test/utils/uuid'
import {ExecutionContext} from '@nestjs/common'

export const validToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMDAwMC0wMDAwLTAwMDAtMDAwMDEiLCJpYXQiOjE2Nzc2Nzg1ODMsImV4cCI6MTY3Nzc2NDk4M30.O90ESBPDsmhVFvwfsnsPxKwf0rpVFShoAu56E3JQfKw'
const nonExistentRefreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMGQwNjg5NjMtY2QzYS00NzRiLTgxY2QtOTdjYTdlZGUwY2MyIiwiaWF0IjoxNjc3Njc4NTgzLCJleHAiOjE2Nzc3NjQ5ODN9.uphFEW52W5ufA1dn7Jg8v3xJO4b6IYDWnVI0IalLwd4'
const resetPasswordSignatureToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF6YXQuYW50b255YW4xMUBnbWFpbC5jb20iLCJpYXQiOjE2NzgyMTQxMTIsImV4cCI6MTY3ODIxNTAxMn0.FfunTTzYR6Jr3Xh-QRthkiZxfPG0lA0e2404va_jloo'
const invalid = 'jwt-invalid-token'

const nonExistentUuid = `e7077df4-941b-4c9d-98bd-4fd718bce250`

export const JWTFixture: JWTData = {
  valid: validToken,
  nonExistent: nonExistentRefreshToken,
  invalid,
  resetPasswordSignature: resetPasswordSignatureToken,
}

export const jwtSign = (): string => JWTFixture.valid

export const jwtVerify = (token: string): Record<string, unknown> => {
  if (token === JWTFixture.invalid) return undefined
  if (token === JWTFixture.valid) return {uuid: uuid(authRefreshTokenId)}
  if (token === JWTFixture.nonExistent) return {uuid: nonExistentUuid}
}

export function canActivate(context: ExecutionContext): boolean {
  const token = context.switchToHttp().getRequest().headers.authorization.split(' ')[1]
  return token === JWTFixture.valid
}
