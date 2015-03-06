# swapify
Swap out your requires!

## Example

index.js
```js
var foo = require('bar')
```

package.json
```json
{
  "browserify": {
    "transform": [ "swapify" ]
  },
  "swapify": {
    "swaps": {
      "^bar$": "./baz.js"
    }
  }
}
```

```sh
browserify index.js -o bundle.js
```

The call to `require('bar')` is replaced with a call to `require('./baz.js')`.