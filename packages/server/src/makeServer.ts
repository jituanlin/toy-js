import {
  IncomingRequestM,
  ResultPayload,
  ServerConfig,
} from '@toy-js/shared/lib/types';
import { Subject } from 'rxjs';
import { createServer } from 'http';
import axios from 'axios';
import { defaultHost, defaultPort } from '@toy-js/shared/lib/constants';

export interface ServerControl {
  close: () => void;
  start: (message?: string) => void;
  request$: Subject<IncomingRequestM>;
  client: {
    post: <T = unknown>(d: unknown) => Promise<ResultPayload<T>>;
    get: <T = unknown>(url: string) => Promise<ResultPayload<T>>;
  };
}

export const makeServer = (
  serverConfig: ServerConfig = {
    port: defaultPort,
    host: defaultHost,
  }
): ServerControl => {
  const request$ = new Subject<IncomingRequestM>();

  const server = createServer((request, response) => {
    request$.next({
      response,
      payload: {
        request,
      },
    });
  });

  const post = async (d: unknown) => {
    const response = await axios.post(
      `http://${serverConfig.host}:${serverConfig.port}`,
      d
    );
    return response.data;
  };

  const get = async (url: string) => {
    const response = await axios.get(
      `http://${serverConfig.host}:${serverConfig.port}/${url}`
    );
    return response.data;
  };

  return {
    request$,
    close: () => server.close(),
    start: (message?: string) =>
      server.listen(
        serverConfig.port,
        serverConfig.port,
        () => message && console.log(message)
      ),
    client: {
      post,
      get,
    },
  };
};
