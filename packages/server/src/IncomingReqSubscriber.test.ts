import { makeServer, ServerControl } from './makeServer';
import { IncomingReqSubscriber } from './IncomingReqSubscriber';
import { InvokePayload } from '@toy-js/shared/lib/types';
import { Codes } from '@toy-js/shared/lib/constants';

describe('IncomingReqSubscriber', () => {
  class FileService {
    constructor(readonly n: number, readonly str: string) {}
    async readFile(): Promise<[number, string]> {
      return [this.n, this.str];
    }
    async readFileError(): Promise<never> {
      throw new Error('mock');
    }
  }
  let serverControl: ServerControl;

  beforeEach(() => {
    serverControl = makeServer();
    serverControl.start();
    serverControl.request$.subscribe(IncomingReqSubscriber([FileService]));
  });

  afterEach(() => {
    serverControl.close();
  });

  it('should response when success', async () => {
    const payload: InvokePayload = {
      serviceName: FileService.name,
      methodName: 'readFile',
      args: [],
      constructArgs: [1, '2'],
    };
    const { data } = await serverControl.client.post(payload);
    expect(data).toEqual([1, '2']);
  });

  it('should response MissMethod error when method missing', async () => {
    const payload: InvokePayload = {
      serviceName: FileService.name,
      methodName: 'noExist',
      args: [],
      constructArgs: [1, '2'],
    };
    const response = await serverControl.client.post(payload);
    expect(response).toEqual({
      code: Codes.MissMethod,
      data: null,
      message: 'can not find method: noExist',
    });
  });

  it('should response MissService error when service missing', async () => {
    const payload: InvokePayload = {
      serviceName: 'NotExistService',
      methodName: 'readFile',
      args: [],
      constructArgs: [1, '2'],
    };
    const response = await serverControl.client.post(payload);
    expect(response).toEqual({
      code: Codes.MissService,
      data: null,
      message: 'can not find service: NotExistService',
    });
  });

  it('should response InvokeFail error when service invoke failed', async () => {
    const payload: InvokePayload = {
      serviceName: FileService.name,
      methodName: 'readFileError',
      args: [],
      constructArgs: [1, '2'],
    };
    const response = await serverControl.client.post(payload);
    expect(response).toEqual({
      code: Codes.InvokeFail,
      data: null,
      message: 'mock',
    });
  });
});
