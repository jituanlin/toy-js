import { ConstructorProxy } from './proxies';
import { Constructor } from '@toy-js/shared/lib/types';

type Services = {
  [index: string]: new <T extends Constructor<any>>(
    ...args: T extends Constructor<unknown, infer P> ? P : never
  ) => T;
};

export const services = new Proxy(
  {},
  {
    get<T>(_: any, p: string): T {
      return (ConstructorProxy(p) as unknown) as T;
    },
  }
) as Services;
