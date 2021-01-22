import * as http from 'http';
import { getRequestBody } from './getRequestBody';
import * as F from 'fp-ts';
import axios from 'axios';
import { AddressInfo } from 'net';

test('getRequestBody', async () => {
  const server = http.createServer(async (request, response) => {
    const body = await getRequestBody(request)();
    F.function.pipe(
      body,
      F.either.map((b) => {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(b));
      })
    );
  });
  const address = server.listen().address() as AddressInfo;
  const response = await axios.post(
    `http://${address.address}:${address.port}`,
    { name: 'jit' }
  );
  expect(response.data).toEqual({ name: 'jit' });
});
