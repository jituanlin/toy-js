import axios from 'axios';

import { Codes } from '@toy-js/shared/lib/constants';
import { InvokePayload } from '@toy-js/shared/lib/types';
import { CodeError } from '@toy-js/shared/lib/errors';

import { clientConfigurator } from './ClientConfigurator';

export const fetchInvokeResult = async <T = unknown>(
  payload: InvokePayload
): Promise<T> => {
  const config = clientConfigurator.getConfig();
  const response = await axios.post(
    `http://${config.host}:${config.port}`,
    payload
  );
  const data = response.data;
  if (data.code === Codes.InvokeSuccess) {
    return data.data;
  }
  throw new CodeError(data.message, data.code);
};
