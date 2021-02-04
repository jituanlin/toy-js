import { Constructor } from '@toy-js/shared/lib/types';
import { clientConfigurator } from './ClientConfigurator';

export const ConstructorProxy = (serviceName: string): Constructor<unknown> => {
  const constructor = (function () {} as unknown) as Constructor<unknown>;

  const proxy = new Proxy(constructor, {
    construct(_, args: readonly unknown[]) {
      return InstanceProxy(serviceName, args);
    },
  });

  return proxy;
};

export const InstanceProxy = (
  serviceName: string,
  constructArgs: readonly unknown[]
): Record<string, (...args: unknown[]) => unknown> => {
  const target = {};

  const proxy = new Proxy(target, {
    get(_, methodName: string) {
      return MethodProxy(serviceName, methodName, constructArgs);
    },
  });

  return proxy;
};

export const MethodProxy = (
  serviceName: string,
  methodName: string,
  constructArgs: readonly unknown[]
): ((...args: unknown[]) => Promise<unknown>) => {
  const method = function () {} as (...args: unknown[]) => Promise<unknown>;

  const proxy = new Proxy(method, {
    apply<T = unknown>(_: any, __: any, args: readonly unknown[]): Promise<T> {
      const fetchInvokeResult = clientConfigurator.getFetchInvokeResult<T>();
      return fetchInvokeResult({
        serviceName,
        methodName,
        args,
        constructArgs,
      });
    },
  });

  return proxy;
};
