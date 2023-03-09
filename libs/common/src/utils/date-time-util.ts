import dayjs, {ManipulateType} from 'dayjs'

export class DateTimeUtil {
  static now(): Date {
    return new Date()
  }

  static toDate(arg: string | Date): Date {
    return new Date(arg)
  }

  static add(quantity: number, unit: ManipulateType): Date {
    return dayjs().add(quantity, unit).toDate()
  }
}
