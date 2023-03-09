import {uuidSuffix} from '@libs/common/constants/constants'

export const uuid = (id: number): string => `${uuidSuffix}${id}`
