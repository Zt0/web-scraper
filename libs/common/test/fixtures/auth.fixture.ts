import {Auth} from '@libs/common/entities'
import {authRefreshTokenId} from '@libs/common/test/ids/auth-ids'
import {uuid} from '@libs/common/test/utils/uuid'

export const validAuthEmail = 'a2@l.eng'
export const validEmailRefreshToken = 'azat.antonyan11@gmail.com'
export const validPassword = 'val1dPassw()rd'

export const authRefreshTokenFixture: Partial<Auth> = {
  id: authRefreshTokenId,
  uuid: uuid(authRefreshTokenId),
  email: validEmailRefreshToken,
}
