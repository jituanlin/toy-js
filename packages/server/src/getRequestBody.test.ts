import { getRequestBody } from './getRequestBody';
import * as F from 'fp-ts';
import { makeServer, ServerControl } from './makeServer';
import { Response } from './utils/Response';
import { Codes } from '@toy-js/shared/lib/constants';

let serverControl: ServerControl;

beforeEach(() => {
  serverControl = makeServer();
  serverControl.start();
});

afterEach(() => {
  serverControl.close();
});

describe('getRequestBody', () => {
  it('should return either.right when successfully parse', async () => {
    serverControl.request$.subscribe(async (incomingRequestM) => {
      const body = await getRequestBody(incomingRequestM.payload.request)();
      const response = Response(incomingRequestM.response);
      F.function.pipe(
        body,
        F.either.map((b) => response(b))
      );
    });

    const { data } = await serverControl.client.post({ name: 'jit' });

    expect(data).toEqual({ name: 'jit' });
  });

  it('should return either.left when parse failed', async () => {
    serverControl.request$.subscribe(async (incomingRequestM) => {
      const body = await getRequestBody(incomingRequestM.payload.request)();
      const response = Response(incomingRequestM.response);
      F.function.pipe(
        body,
        F.either.mapLeft((e) => response(null, e.code, e.message))
      );
    });

    const response = await serverControl.client.get('any');

    expect(response).toEqual({
      code: Codes.ParseInvokePayload,
      data: null,
      message: 'Unexpected end of JSON input',
    });
  });
});
