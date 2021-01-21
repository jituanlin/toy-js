# `@toy-js/client`

Expose the API client created by *@toy-js/server*.

## usage
```ts
import {services} from '@toy-js/client';
import type {FileSystem} from 'path-to-your-toy-js-services/FileSystem';

const fs = services.FileSystem<File>();
fs.readFile('path.filename').then(console.log);
```

## how it works
The `services`(from `import {services} from '@toy-js/client'`) is a `service namespace Proxy`
which simulates itself as a service namespace.

When get service by `service.FileSystem<File>`, it returns a `Constuctor Proxy` which 
simulates itself as a service constructor.

After instantiate service constructor proxy, the return is an `Instance Proxy` which
simulate itself as a service instance.

For type reference, you should pass type(`import type {FileSystem} from 'path-to-your-toy-js-services/FileSystem'`)
to when instantiate it.

Finally, when make a call of `instance Proxy`, an HTTP invocation to the *@toy-js/server* 's service
is made.

