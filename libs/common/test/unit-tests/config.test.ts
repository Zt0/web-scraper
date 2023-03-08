import {Config} from '@libs/common/configuration'

it('not matches without special character password', () => {
  const nonExistentSecret = Config.get('NON_EXISTENT_SECRET')
  expect(nonExistentSecret).toBeUndefined()
})
