import {DateTimeUtil} from '@libs/common/utils/date-time-util'

const string1 = '2022-07-07T00:00:00.000Z'
const date1 = new Date(string1)

describe('DateTime Util', () => {
  it('to date', () => {
    expect(DateTimeUtil.toDate(string1)).toEqual(date1)
  })

  it('add', () => {
    expect(Number(DateTimeUtil.add(4, 'day'))).toBeGreaterThan(Number(DateTimeUtil.add(3, 'day')))
  })
})
