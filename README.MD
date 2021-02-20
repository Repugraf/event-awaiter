### Event Awaiter

***
Do you have a problem with asynchronous operations where you need to wait for some other event to finish before you continue processing the current one? This package solves this problem.  
  
The package can be used in browser (using EventTarget) or nodejs (using EventEmitter)
***

### Installation

```npm i event-awaiter```
***

### Usage
```js
const { getEventAwaiter } = require("event-awaiter");
const ea = getEventAwaiter({
  timeout: 20000 // number of milliseconds after event will get rejected
});

const key = "uniqueKey";

const needToBeAwaited = async () => {
  const payload = await ea.setupListener(key); // will be awaited
  console.log(payload);
}

needToBeAwaited();
ea.dispatchEvent(key, "hello world!");
```
***

### Common Use Cases
- WebSocket events
- RabbitMQ events
***

The package doesn't support IE