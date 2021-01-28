import { Context } from './types/Context';
import { makeServer, ServerControl } from './makeServer';

export const runServer = (context: Context): ServerControl => {
  const config = context.serverConfigurator.getConfig();

  const serverControl = makeServer(context.serverConfigurator.getConfig());

  serverControl.request$.subscribe(context.incomingRequest$.next);
  context.incomingRequest$.subscribe(
    context.serverConfigurator.getSubscriber()
  );

  process.nextTick(() =>
    serverControl.start(`running server on ${config.host}:${config.port}`)
  );
  return serverControl;
};
