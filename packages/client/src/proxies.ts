import { Constructor } from '@toy-js/shared/lib/types';
import { clientConfigurator } from './ClientConfigurator';

export const ConstructorProxy = (serviceName: string): Constructor<unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return (new Proxy(function () {}, {
    construct() {
      return InstanceProxy(serviceName);
    },
  }) as unknown) as Constructor<unknown>;
};

export const InstanceProxy = (
  serviceName: string
): Record<string, (...args: unknown[]) => unknown> => {
  return new Proxy(
    {},
    {
      get(_, p: string) {
        return MethodProxy(serviceName, p);
      },
    }
  );
};

export const MethodProxy = (
  serviceName: string,
  methodName: string
): ((...args: unknown[]) => unknown) => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return new Proxy(function () {}, {
    apply<T = unknown>(_: any, __: any, args: readonly unknown[]): Promise<T> {
      const fetchInvokeResult = clientConfigurator.getFetchInvokeResult();
      return fetchInvokeResult({
        serviceName,
        methodName,
        args,
      });
    },
  });
};
