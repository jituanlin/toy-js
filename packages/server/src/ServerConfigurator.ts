import { defaultHost, defaultPort } from '@toy-js/shared/lib/constants';
import { IncomingRequestSubscriber, ServerConfig } from '@toy-js/shared/lib/types';

import { IncomingReqSubscriber } from './IncomingReqSubscriber';
import { services } from './services';

export class ServerConfigurator {
  private config: ServerConfig;
  private subscriber: IncomingRequestSubscriber;

  constructor(config: ServerConfig, subscriber: IncomingRequestSubscriber) {
    this.config = config;
    this.subscriber = subscriber;
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

  setSubscriber(subscriber: IncomingRequestSubscriber): this {
    this.subscriber = subscriber;
    return this;
  }

  getSubscriber(): IncomingRequestSubscriber {
    return this.subscriber;
  }
}

export const serverConfigurator = new ServerConfigurator(
  {
    port: defaultPort,
    host: defaultHost,
  },
  IncomingReqSubscriber(services)
);
