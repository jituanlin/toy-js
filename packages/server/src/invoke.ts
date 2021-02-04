import * as F from 'fp-ts';

import { Constructor, InvokePayload, Services } from '@toy-js/shared/lib/types';

import {
  CodeError,
  InvokeFailError,
  MissMethodError,
  MissServiceError,
} from '@toy-js/shared/lib/errors';
import { getRequestBody } from './getRequestBody';
import { IncomingMessage } from 'http';

const invokeService = (services: Services) => (
  serviceName: string,
  methodName: string,
  args: readonly unknown[],
  constructArgs: readonly unknown[]
): F.taskEither.TaskEither<CodeError, unknown> => {
  const service = F.function.pipe(
    services,
    F.readonlyArray.findFirst((service) => service.name === serviceName),
    F.either.fromOption(() => new MissServiceError(serviceName))
  );

  const serviceInstance = F.function.pipe(
    service,
    F.either.map(
      (service: Constructor<unknown>) =>
        new service(...constructArgs) as Record<string, unknown>
    )
  );

  const invokeMethod = (instance: Record<string, unknown>) => {
    if (typeof instance[methodName] !== 'function') {
      return F.taskEither.left(new MissMethodError(methodName));
    }

    return F.function.pipe(
      F.taskEither.tryCatch(() => (instance[methodName] as any)(...args)),
      F.taskEither.mapLeft((error: any) => new InvokeFailError(error.message))
    );
  };

  return F.function.pipe(
    serviceInstance,
    F.taskEither.fromEither,
    F.taskEither.chainW(invokeMethod)
  );
};

export const parsePayloadThenInvokeService = (services: Services) => (
  req: IncomingMessage
): F.taskEither.TaskEither<CodeError, unknown> =>
  F.function.pipe(
    getRequestBody<InvokePayload>(req),
    F.taskEither.chainW((invokePayload) =>
      invokeService(services)(
        invokePayload.serviceName,
        invokePayload.methodName,
        invokePayload.args,
        invokePayload.constructArgs
      )
    )
  );
