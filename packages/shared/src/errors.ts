import { Codes } from './constants'

export class CodeError extends Error {
  constructor(message: string, readonly code: Codes) {
    super(message)
  }
}

export class MissServiceError extends CodeError {
  constructor(serviceName: string) {
    super(`can not find service: ${serviceName}`, Codes.MissService)
  }
}

export class MissMethodError extends CodeError {
  constructor(methodName: string) {
    super(`can not find method: ${methodName}`, Codes.MissMethod)
  }
}

export class ParseInvokePayloadError extends CodeError {
  constructor(message: string) {
    super(message, Codes.ParseInvokePayload)
  }
}

export class InvokeFailError extends CodeError {
  constructor(message: string) {
    super(message, Codes.InvokeFail)
  }
}
