import * as F from 'fp-ts';
import * as R from 'ramda';

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
  args: readonly unknown[]
): F.taskEither.TaskEither<CodeError, unknown> => {
  const service = F.function.pipe(
    services,
    R.find<Constructor<unknown>>(R.propEq('name', serviceName)),
    F.either.fromNullable(() => new MissServiceError(serviceName))
  );

  const serviceInstance = F.function.pipe(
    service,
    F.either.map(
      (service: Constructor<unknown>) =>
        new service() as Record<string, unknown>
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
    F.taskEither.chain(invokeMethod)
  );
};

export const parsePayloadThenInvokeService = (services: Services) => (
  req: IncomingMessage
): F.taskEither.TaskEither<CodeError, unknown> =>
  F.function.pipe(
    getRequestBody<InvokePayload>(req),
    F.taskEither.chain((invokePayload) =>
      invokeService(services)(
        invokePayload.serviceName,
        invokePayload.methodName,
        invokePayload.args
      )
    )
  );