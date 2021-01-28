import { Subject } from 'rxjs';
import { IncomingRequestM } from '@toy-js/shared/lib/types';

export const incomingRequest$ = new Subject<IncomingRequestM>();
