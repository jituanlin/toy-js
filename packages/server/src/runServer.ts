import { createServer } from 'http';
import { Context } from './types/Context'


export const runServer = (context: Context): void => {
  const config = context.serverConfigurator.getConfig();
  const server = createServer((request, response) =>
    context.incomingRequest$.next({
      response,
      payload: {
        request,
      },
    })
  );

  context.incomingRequest$.subscribe(
    context.serverConfigurator.getSubscriber()
  );

  process.nextTick(() =>
    server.listen(config.port, config.host, () => {
      console.info(`running server on ${config.host}:${config.port}`);
    })
  );
};
