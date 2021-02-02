import { clientConfigurator } from './ClientConfigurator';
import { InvokePayload } from '@toy-js/shared/lib/types';
import { services } from './services';

interface File {
  readFile(path: string): Promise<string>;
}

describe('proxies', () => {
  const payloads: InvokePayload[] = [];
  clientConfigurator.setFetchInvokeResult(async (payload) =>
    payloads.push(payload)
  );

  it('should collect context to construct a request', async function () {
    const fileService = new services.File<File>();
    const idx = await fileService.readFile('./.tmp.txt');
    expect(idx).toEqual(1);
    expect(payloads).toEqual([
      [
        {
          args: ['./.tmp.txt'],
          methodName: 'readFile',
          serviceName: 'File',
        },
      ],
    ]);
  });
});
