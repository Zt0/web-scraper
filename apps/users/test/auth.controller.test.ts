import {NestFastifyApplication} from '@nestjs/platform-fastify'
import request from 'supertest'
import {DataSource} from 'typeorm'
import {JwtService} from '@nestjs/jwt'
import {MailerService} from '@nestjs-modules/mailer'
import {UsersApp} from '@apps/users'
import {generateTestApp} from '@libs/common/test/app-factory'
import {DBConnection} from '@libs/common/typeorm/connection'
import {portGenerator} from '@libs/common/test/utils/increment-id'
import {canActivate, JWTFixture, jwtSign, jwtVerify} from '@libs/common/test/utils/jwt'
import {ResponseStatusCodes} from '@libs/common/dto/response-status.dto'
import {
  AUTH_NOT_FOUND,
  INVALID_EMAIL_OR_PASSWORD,
  INVALID_OTP,
  INVALID_REFRESH_TOKEN,
  REFRESH_TOKEN,
  REGISTER,
  USER_NOT_FOUND,
  VALIDATE_CREDENTIALS,
} from '@libs/common/errors'
import {
  validAuthEmail,
  validEmailRefreshToken,
  validPassword,
} from '@libs/common/test/fixtures/auth.fixture'
import {HttpStatus} from '@nestjs/common'
import {JwtAuthGuard} from '@libs/common/guards/jwt-auth.guard'
import {sendMail} from '@libs/common/test/utils/send-mail'
import {AuthRepository, OtpCodesRepository} from '@libs/common/repositories'
import {activeOtpCode, expiredOtpCode} from '@libs/common/test/fixtures/otp-codes.fixture'
import {Gender} from '@libs/common/enums/user'

const spyJwtServiceSign = jest.spyOn(JwtService.prototype, 'sign')
spyJwtServiceSign.mockImplementation(jwtSign)

const spyJwtServiceVerify = jest.spyOn(JwtService.prototype, 'verify')
spyJwtServiceVerify.mockImplementation(jwtVerify)

const spyJwtAuthGuardCanActivate = jest.spyOn(JwtAuthGuard.prototype, 'canActivate')
spyJwtAuthGuardCanActivate.mockImplementation(canActivate)

const spyMailerServiceSendMail = jest.spyOn(MailerService.prototype, 'sendMail')
spyMailerServiceSendMail.mockImplementation(sendMail)

// eslint-disable-next-line max-lines-per-function
describe('AuthController', () => {
  const authV1 = '/v1/auth'
  let app: NestFastifyApplication
  let server
  let dataSource: DataSource
  let authRepository: AuthRepository
  let otpCodesRepository: OtpCodesRepository

  beforeAll(async () => {
    const testModule = await generateTestApp(UsersApp, portGenerator())
    app = testModule.app
    server = testModule.server
    dataSource = await DBConnection()
    authRepository = new AuthRepository(dataSource)
    otpCodesRepository = new OtpCodesRepository(dataSource)
  })

  let otp: number
  let verifyOtpToken: string
  //todo update test when EI arrives)

  describe('register', () => {
    it('success to register user auth (POST)', async () => {
      const res = await request(server).post(`${authV1}/register`).send({
        email: validAuthEmail,
        password: validPassword,
      })
      expect(res.status).toBe(HttpStatus.NO_CONTENT)
      const auth = await authRepository.findOneByEmail(validAuthEmail)
      expect(auth).toBeTruthy()
    })

    it('fail to register user auth (POST) | user with given email already exists', async () => {
      const res = await request(server).post(`${authV1}/register`).send({
        email: validAuthEmail,
        password: validPassword,
      })
      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(res.body.status.message).toBe(REGISTER)
      expect(res.body.status.code).toBe(ResponseStatusCodes.InternalServerError)
    })
  })

  describe('login', () => {
    it('fail to login user auth (POST) | auth with given email not found', async () => {
      const res = await request(server).post(`${authV1}/login`).send({
        email: validAuthEmail,
        password: 1,
      })
      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(res.body.status.message).toBe(VALIDATE_CREDENTIALS)
      expect(res.body.status.code).toBe(ResponseStatusCodes.InternalServerError)
    })

    it('fail to login user auth (POST) | auth with given email not found', async () => {
      const res = await request(server).post(`${authV1}/login`).send({
        email: 'not@found.email',
        password: validPassword,
      })
      expect(res.status).toBe(HttpStatus.NOT_FOUND)
      expect(res.body.status.message).toBe(AUTH_NOT_FOUND)
      expect(res.body.status.code).toBe(ResponseStatusCodes.NotFound)
    })

    it('fail to login user auth (POST) | auth with given password not found', async () => {
      const res = await request(server).post(`${authV1}/login`).send({
        email: validAuthEmail,
        password: 'n0tf@undPa55w()rd',
      })
      expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
      expect(res.body.status.message).toBe(INVALID_EMAIL_OR_PASSWORD)
      expect(res.body.status.code).toBe(ResponseStatusCodes.Unauthorized)
    })

    it('success to login user auth (POST)', async () => {
      const res = await request(server).post(`${authV1}/login`).send({
        email: validAuthEmail,
        password: validPassword,
      })
      expect(res.status).toBe(HttpStatus.OK)
      expect(res.body.status.code).toBe(ResponseStatusCodes.Succeed)
    })
  })

  describe('refresh-token', () => {
    it('fail to get access token from refresh token (POST) | invalid signature', async () => {
      const res = await request(server).post(`${authV1}/refresh-token`).send({
        refreshToken: JWTFixture.getAccessTokenFailure,
      })
      expect(res.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
      expect(res.body.status.message).toBe(REFRESH_TOKEN)
      expect(res.body.status.code).toBe(ResponseStatusCodes.InternalServerError)
    })

    it('fail to get access token from refresh token (POST) | no auth', async () => {
      const res = await request(server).post(`${authV1}/refresh-token`).send({
        refreshToken: JWTFixture.nonExistent,
      })
      expect(res.status).toBe(HttpStatus.UNAUTHORIZED)
      expect(res.body.status.message).toBe(INVALID_REFRESH_TOKEN)
      expect(res.body.status.code).toBe(ResponseStatusCodes.Unauthorized)
    })

    it('success to get access token from refresh token (POST)', async () => {
      const res = await request(server).post(`${authV1}/refresh-token`).send({
        refreshToken: JWTFixture.valid,
      })
      expect(res.status).toBe(HttpStatus.OK)
      expect(res.body.status.code).toBe(ResponseStatusCodes.Succeed)
    })
  })

  describe('forgot-password', () => {
    it('fail to get otp token (POST) | user with received email not found', async () => {
      //todo change to auth not found, if needed
      const UserResponse = await request(server)
        .post('/v1/user')
        .set({Authorization: `Bearer ${JWTFixture.valid}`})
        .send({
          firstName: 'Jack',
          middleName: 'Lee',
          lastName: 'Preston',
          dateOfBirth: '1970-10-10',
          gender: Gender.Male,
          address: 'OHIO',
          description: ':)',
        })

      expect(UserResponse.status).toBe(HttpStatus.OK)
      expect(UserResponse.body.status.code).toBe(ResponseStatusCodes.Succeed)

      const res = await request(server).post(`${authV1}/forgot-password`).send({
        email: 'not@found.email',
      })
      expect(res.status).toBe(HttpStatus.NOT_FOUND)
      expect(res.body.status.message).toBe(USER_NOT_FOUND)
      expect(res.body.status.code).toBe(ResponseStatusCodes.NotFound)
    })

    it('fail to get otp token (POST) | auth without user', async () => {
      const res = await request(server).post(`${authV1}/forgot-password`).send({
        email: validAuthEmail,
      })
      expect(res.status).toBe(HttpStatus.NOT_FOUND)
      expect(res.body.status.message).toBe(USER_NOT_FOUND)
      expect(res.body.status.code).toBe(ResponseStatusCodes.NotFound)
    })

    it('success to get otp token (POST)', async () => {
      const res = await request(server).post(`${authV1}/forgot-password`).send({
        email: validEmailRefreshToken,
      })
      const otpRegex = /\d{6}/
      otp = res.body.data.otp
      expect(res.status).toBe(HttpStatus.OK)
      expect(res.body.status.code).toBe(ResponseStatusCodes.Succeed)
      expect(otp).toMatch(otpRegex)
    })
  })

  describe('verify-otp', () => {
    it('fail to verify otp (POST) | invalid email', async () => {
      const res = await request(server).post(`${authV1}/verify-otp`).send({
        email: 'not@found.email',
        otp: otp,
      })
      expect(res.status).toBe(HttpStatus.BAD_REQUEST)
      expect(res.body.status.message).toBe(INVALID_OTP)
      expect(res.body.status.code).toBe(ResponseStatusCodes.BadRequest)
    })

    it('fail to verify otp (POST) | invalid otp', async () => {
      const res = await request(server).post(`${authV1}/verify-otp`).send({
        email: validEmailRefreshToken,
        otp: '1111111',
      })
      expect(res.status).toBe(HttpStatus.BAD_REQUEST)
      expect(res.body.status.message).toBe(INVALID_OTP)
      expect(res.body.status.code).toBe(ResponseStatusCodes.BadRequest)
    })

    it('success to verify otp (POST)', async () => {
      const res = await request(server).post(`${authV1}/verify-otp`).send({
        email: validEmailRefreshToken,
        otp,
      })
      expect(res.body.data).toBeTruthy()
      verifyOtpToken = res.body.data.verifyOtpToken
      expect(res.status).toBe(HttpStatus.OK)
      expect(res.body.status.code).toBe(ResponseStatusCodes.Succeed)
    })
  })

  describe('reset-password', () => {
    it('success to reset password (POST)', async () => {
      const res = await request(server)
        .post(`${authV1}/reset-password`)
        .send({
          password: validPassword,
        })
        .set({Authorization: `Bearer ${verifyOtpToken}`})
      expect(res.status).toBe(HttpStatus.OK)
      expect(res.body.status.code).toBe(ResponseStatusCodes.Succeed)
    })
  })

  describe('remove-expired-otps', () => {
    it('success to remove expired otps (Cronjob)', async () => {
      const res = await request(server).post(`${authV1}/remove-expired-otps`)
      const activeOtpCodes = await otpCodesRepository.find()
      expect(activeOtpCodes.find((e) => e.token == activeOtpCode.token)).toBeTruthy()
      expect(activeOtpCodes.find((e) => e.id === expiredOtpCode.id)).toBeUndefined()
      expect(res.status).toBe(HttpStatus.OK)
      expect(res.body.status.code).toBe(ResponseStatusCodes.Succeed)
    })
  })

  afterAll(async () => {
    await otpCodesRepository.delete({id: activeOtpCode.id})
    jest.resetAllMocks()
    await dataSource.destroy()
    await app.close()
  })
})
