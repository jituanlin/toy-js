import { IncomingMessage } from 'http';

import * as F from 'fp-ts';

import { CodeError, ParseInvokePayloadError } from '@toy-js/shared/lib/errors';

export const getRequestBody = <T>(
  req: IncomingMessage
): F.taskEither.TaskEither<CodeError, T> =>
  F.taskEither.tryCatch(() => {
    return new Promise((resolve, reject) => {
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new ParseInvokePayloadError(error.message));
        }
      });
    });
  }) as F.taskEither.TaskEither<CodeError, T>;
