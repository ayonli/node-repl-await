# Node's processTopLevelAwait

Standalone util function from Node.js core to process await statements in REPL.

Since v10.0.0, Node.js introduced a new experimental feature to support `await` 
keyword in the REPL by using the argument `--experimental-repl-await`, however,
if a user wants to implement a custom REPL console, there would be no
await-support at all, to achieve such a goal, this package clones the internal
module of await-support to form a standalone version, allowing users share the 
benefits of await-support in their own REPL environments.

See
[Node.js docs](https://nodejs.org/dist/latest-v11.x/docs/api/repl.html#repl_await_keyword)
for more details, and contribute to the
[original source](https://github.com/nodejs/node/blob/master/lib/internal/repl/await.js).

## Example

```javascript
const repl = require("repl");
const vm = require("vm");
const { processTopLevelAwait } = require("node-repl-await");

function isRecoverableError(error) {
    if (error.name === 'SyntaxError') {
        return /^(Unexpected end of input|Unexpected token)/.test(error.message);
    }
    return false;
}

async function myEval(code, context, filename, callback) {
    code = processTopLevelAwait(code) || code;

    try {
        let result = await vm.runInNewContext(code, context);
        callback(null, result);
    } catch (e) {
        if (isRecoverableError(e)) {
            callback(new repl.Recoverable(e));
        } else {
            console.log(e);
        }
    }
}

repl.start({ prompt: '> ', eval: myEval });
```

## API

```typescript
function processTopLevelAwait(src: string): string | void
```

Tries to wrap the given source code to an immediately-invoked function if it 
contains any top level `await` statement in the form of

```js
(async () => { /* source code */ })()
```

If no `await` presents or processing failed, the function returns `null`.