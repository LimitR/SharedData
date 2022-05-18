# SharedData

Init class
```javascript
const SharedData = require(".");
const buf = new SharedData(1024);
```

main.js
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
service.js
```javascript
const { workerData } = require('worker_threads');

const Buf = require(".");
const buf = new Buf(1024);

console.log(buf.serialize(workerData)); // { key: 'value', key2: [ 1, 2, 3 ] }

// Or
const { workerData } = require('worker_threads');

const Buf = require(".");
const buf = new Buf().new(workerData);
console.log(buf.serialize()); // { key: 'value', key2: [ 1, 2, 3 ] }
```

###Shared in thread

service.js
```javascript
buf.add({key: "cool"})
```

main.js
```javascript
console.log(buf.serialize()); // { key: 'cool' }
```