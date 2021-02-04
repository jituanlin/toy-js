import { IncomingMessage, ServerResponse } from 'http'

export type Constructor<T, P extends any[] = any[]> = {
  new (...args: P): T
}

export type ServiceConstructor = Constructor<{
  [index: string]: () => Promise<unknown>
}>

export interface InvokePayload<T = unknown> {
  serviceName: string
  methodName: string
  args: readonly T[]
  constructArgs: readonly unknown[]
}

export interface ResultPayload<T = unknown> {
  data: T
  code: number
  message: string
}

export interface ServerConfig {
  host: string
  port: number
}

export interface ClientConfig {
  host: string
  port: number
}

export interface IncomingRequest<T> {
  response: ServerResponse
  payload: T
}

export type Services = Constructor<unknown>[]

export type IncomingRequestM = IncomingRequest<{ request: IncomingMessage }>

export type IncomingRequestSubscriber = (req: IncomingRequestM) => void

export type FetchInvokeResult<T = unknown> = (payload: InvokePayload) => Promise<T>
