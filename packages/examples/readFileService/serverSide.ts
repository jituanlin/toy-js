import fs from 'fs/promises';
import path from 'path';

import { Service } from '../../server/src';

@Service()
export class File {
  async readFile(path$: string): Promise<string> {
    const buffer = await fs.readFile(path.join(__dirname, path$));
    return buffer.toString();
  }
}
