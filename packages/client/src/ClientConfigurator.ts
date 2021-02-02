import { defaultHost, defaultPort } from '@toy-js/shared/lib/constants';
import {
  ClientConfig,
  FetchInvokeResult,
  ServerConfig,
} from '@toy-js/shared/lib/types';

import { fetchInvokeResult } from './fetchs';

export class ClientConfigurator {
  private config: ClientConfig;
  private fetchInvokeResult: FetchInvokeResult;

  constructor(config: ClientConfig, fetchInvokeResult: FetchInvokeResult) {
    this.config = config;
    this.fetchInvokeResult = fetchInvokeResult;
  }

  getConfig(): ServerConfig {
    return this.config;
  }

  setHost(host: string): this {
    this.config.host = host;
    return this;
  }

  setPort(port: number): this {
    this.config.port = port;
    return this;
  }

  setFetchInvokeResult<T = unknown>(
    fetchInvokeResult: FetchInvokeResult<T>
  ): this {
    this.fetchInvokeResult = fetchInvokeResult;
    return this;
  }

  getFetchInvokeResult(): FetchInvokeResult {
    return this.fetchInvokeResult;
  }
}

export const clientConfigurator: ClientConfigurator = new ClientConfigurator(
  {
    host: defaultHost,
    port: defaultPort,
  },
  fetchInvokeResult
);
