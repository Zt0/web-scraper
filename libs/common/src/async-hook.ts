import {AsyncLocalStorage} from 'async_hooks'
import {v4} from 'uuid'
import {RequestMetadata} from '@libs/common/types/request'

export const asyncStorage = new AsyncLocalStorage<RequestMetadata>()

export const createRequestContext = (): RequestMetadata => ({
  requestId: v4(),
})

export const getRequestContext = (): RequestMetadata => asyncStorage.getStore()
