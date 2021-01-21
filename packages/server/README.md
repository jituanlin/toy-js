# `@toy-js/server`

Make create simple HTTP server easier.

## Usage

### step1
Declare a service:
```ts
import { Service } from '@toy-js/server';
import {promises as fs} from 'fs'

@Service()
class FileSystem {
  constructor() {
  }
  async readFile(path:string):Promise<string>{
    const buffer = fs.readFile(path)
    return buffer.toString()
  }
}
```
### step2
Run it:
`ts-node path-to-your-toy-js-services/FileSystem.ts`

The console will show the message indicates the server is running.

### step3
Invoke service from front-end. 

For more details, please refer to [@toy-js/client](https://github.com/jituanlin/toy-js/tree/master/packages/client).

