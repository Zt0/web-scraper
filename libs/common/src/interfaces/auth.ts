export interface ITokenPayload {
  iat: number
  exp: number
  uuid: string
}

export interface JWTData {
  valid: string
  nonExistent: string
  invalid: string
  resetPasswordSignature: string
}
