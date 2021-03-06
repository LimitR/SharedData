# SharedData

With this library, you can send data between threads without having to pass PostMessage.

```
npm i shared-data
```

## Init class

```javascript
const SharedData = require("shared-data");
const buf = new SharedData(1024, "int32");
// Or
const buf = new SharedData(); // default length = 1024; default type = "int32";
```

### main.js

```javascript
const { Worker } = require('node:worker_threads');
buf.add({
    key: "value",
    key2: [
        1, 2, 3
    ]
})
const worker = new Worker('./service.js', { workerData: buf.get() });
```

### service.js

```javascript
const { workerData } = require('worker_threads');

const SharedData = require(".");
const buf = new SharedData(1024, "int32");

console.log(await buf.serialize(workerData)); // { key: 'value', key2: [ 1, 2, 3 ] }

// Or

const buf = new SharedData().new(workerData);
console.log(await buf.serialize()); // { key: 'value', key2: [ 1, 2, 3 ] }
```

## Shared in thread

### service.js

```javascript
await buf.add({key: "cool"});
// or
buf.na_add({key: "cool"});

```

### main.js

```javascript
console.log(await buf.serialize()); // { key: 'cool' }
console.log(await buf.get(0, 16)); // [ 255, 13, 111, 34, 3, 107, 101, 121, 34, 4, 99, 111, 111, 108, 123, 1 ]
console.log(buf.na_get()); // Int32Array(256) [ 255, 13, 111, 34, 3, 107, 101, 121, 34, 4, 99, 111, 111, 108, 123, 1, ... 156 more items ]
```