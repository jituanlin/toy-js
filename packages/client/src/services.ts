import { ConstructorProxy } from './proxies';

type Services = {
  [index: string]: new <T>(...args: readonly unknown[]) => T;
};

export const services = new Proxy(
  {},
  {
    get<T>(_: any, p: string): T {
      return (ConstructorProxy(p) as unknown) as T;
    },
  }
) as Services;
