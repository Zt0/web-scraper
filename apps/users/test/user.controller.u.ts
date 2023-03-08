import {NestFastifyApplication} from '@nestjs/platform-fastify'
import {generateTestApp} from '@libs/common/test/app-factory'
import {UsersApp} from '@apps/users'
import {portGenerator} from '@libs/common/test/utils/increment-id'
import request from 'supertest'
import {HttpStatus} from '@nestjs/common'
import {AUTH_NOT_FOUND} from '@libs/common/errors'
import {ResponseStatusCodes} from '@libs/common/dto/response-status.dto'
import {JWTFixture, jwtVerify} from '@libs/common/test/utils/jwt'
import {Gender} from '@libs/common/enums/user'
import {JwtService} from '@nestjs/jwt'

const spyJwtServiceVerify = jest.spyOn(JwtService.prototype, 'verify')
spyJwtServiceVerify.mockImplementation(jwtVerify)

describe('UserController', () => {
  const userV1 = '/v1/user'
  let app: NestFastifyApplication
  let server

  beforeAll(async () => {
    const testModule = await generateTestApp(UsersApp, portGenerator())
    app = testModule.app
    server = testModule.server
  })

  describe('register', () => {
    it('fail to create user (POST) | auth not found', async () => {
      const res = await request(server)
        .post(`${userV1}`)
        .set({Authorization: `Bearer ${JWTFixture.nonExistent}`})
        .send({
          firstName: 'Mark',
          middleName: 'Anthony',
          lastName: 'Selby',
          dateOfBirth: '1983-06-19',
          gender: Gender.Male,
          address: 'OHIO',
          description: ':)',
        })
      expect(res.status).toBe(HttpStatus.NOT_FOUND)
      expect(res.body.status.message).toBe(AUTH_NOT_FOUND)
      expect(res.body.status.code).toBe(ResponseStatusCodes.NotFound)
    })
  })

  afterAll(async () => {
    jest.resetAllMocks()
    await app.close()
  })
})
