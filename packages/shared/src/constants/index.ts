export enum Codes {
  InvokeSuccess = 1000,
  InvokeFail,
  ParseInvokePayload,
  MissService,
  MissMethod,
}

export enum Messages {
  InvokeSuccess = 'success',
}

export const defaultHost = '127.0.0.1';

export const defaultPort = 8090;
