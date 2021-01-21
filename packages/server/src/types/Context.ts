import { ServerConfigurator } from '../ServerConfigurator';
import { incomingRequest$ } from '../incomingRequest$';
import { Services } from '@toy-js/shared/lib/types'


export interface Context {
  serverConfigurator: ServerConfigurator;
  services: Services;
  incomingRequest$: typeof incomingRequest$;
}
