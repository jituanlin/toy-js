import { services } from '../../client/src';

import type { File } from './serverSide';

const file = new services.File<File>();
file.readFile('./resource.txt').then(console.log);
