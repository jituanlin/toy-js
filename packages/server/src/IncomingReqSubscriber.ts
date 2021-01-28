import * as F from 'fp-ts';
import { IncomingRequestM, Services } from '@toy-js/shared/lib/types';
import { parsePayloadThenInvokeService } from './invoke';
import { Response } from './utils/Response';

export const IncomingReqSubscriber = (services: Services) => (
  incomingReqM: IncomingRequestM
): void => {
  const response = Response(incomingReqM.response);
  const invokeResult = parsePayloadThenInvokeService(services)(
    incomingReqM.payload.request
  );
  F.function.pipe(
    invokeResult,
    F.taskEither.fold(
      (error) => F.task.of(response(null, error.code, error.message)),
      (result) => F.task.of(response(result))
    )
  )();
};
