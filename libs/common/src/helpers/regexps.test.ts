import {regExPassword} from '@libs/common/helpers/regexps'

it('matches password', () => {
  const password = '1bAaaaa#'
  expect(password).toMatch(regExPassword)
})

it('not matches without special character password', () => {
  const password = '1aAadaas'
  expect(password).not.toMatch(regExPassword)
})

it('not matches without number password', () => {
  const password = 'aBaaaaa#'
  expect(password).not.toMatch(regExPassword)
})

it('not matches without uppercase letter password', () => {
  const password = 'aa3aa#'
  expect(password).not.toMatch(regExPassword)
})

it('not matches without lowercase letter password', () => {
  const password = 'BB3BB#'
  expect(password).not.toMatch(regExPassword)
})
