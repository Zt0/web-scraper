import {FastifyRequest} from 'fastify'

export type RequestMetadata = {requestId: string}
export type RequestWithUUID = FastifyRequest & {uuid: string}
export type RequestWithEmail = FastifyRequest & {email: string}
