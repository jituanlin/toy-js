import { serverConfigurator } from './ServerConfigurator';
import { incomingRequest$ } from './incomingRequest$';
import { runServer } from './runServer';
import { services } from './services';
import { Constructor } from '@toy-js/shared/lib/types';

export const Service = () => <T>(
  constructor: Constructor<T>
): Constructor<T> => {
  services.push(constructor);
  return constructor;
};

const main = () => {
  runServer({
    incomingRequest$,
    serverConfigurator,
    services,
  });
};

main();
