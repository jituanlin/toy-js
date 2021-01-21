import { ServerResponse } from 'http';

import { Codes, Messages } from '@toy-js/shared/lib/constants';

export const Response = (res: ServerResponse) => <T = unknown>(
  result: T,
  code = Codes.InvokeSuccess,
  message: string = Messages.InvokeSuccess
): void => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.end(
    JSON.stringify({
      data: result,
      code,
      message,
    })
  );
};
