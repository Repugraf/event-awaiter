import { strict as assert } from "assert";
const { equal, rejects, notEqual } = assert;
import { getEventAwaiter } from "../";

const eventAwaiter = getEventAwaiter({ timeout: 1000 });

const key = "key";

const rejectCases = [
  { key, payload: true, timeout: 2000 }, // timeout
  { key, payload: "hello", timeout: 500 } // duplicate key
];

const wrongCases = [
  { key, payload: true, timeout: 400, output: false } // true !== false
];

const successCases = [
  { key, payload: 1, timeout: 500, output: 1 }, // 1 === 1
  { key: key.repeat(2), payload: false, timeout: 200, output: false } // false === false
];

const main = async () => {
  await Promise.all(rejectCases.map(el => {
    return rejects(async () => new Promise((resolve, reject) => {
      eventAwaiter.setupListener(el.key).then(resolve).catch(reject);
      setTimeout(() => eventAwaiter.dispatchEvent(el.key, el.payload), el.timeout);
    }));
  }));

  await Promise.all(wrongCases.map(async el => {
    const val = await new Promise((resolve, reject) => {
      eventAwaiter.setupListener(el.key).then((v) => resolve(v)).catch(reject);
      setTimeout(() => eventAwaiter.dispatchEvent(el.key, el.payload), el.timeout);
    });
    notEqual(val, el.output);
  }));

  await Promise.all(successCases.map(async el => {
    const val = await new Promise((resolve, reject) => {
      eventAwaiter.setupListener(el.key).then((v) => resolve(v)).catch(reject);
      setTimeout(() => eventAwaiter.dispatchEvent(el.key, el.payload), el.timeout);
    });
    equal(val, el.output);
  }));

  // tslint:disable-next-line: no-console
  console.log("tests passed successfully!");
};

main();