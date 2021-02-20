import { strictEqual, notStrictEqual, rejects } from "assert";
import { getEventAwaiter } from ".";

describe("getEventAwaiter tests", () => {
  const key = "key";

  test("reject cases", async () => {
    const eventAwaiter = getEventAwaiter({ timeout: 1000 });

    const rejectCases = [
      { key, payload: true, timeout: 2000 }, // timeout
      { key, payload: "hello", timeout: 500 } // duplicate key
    ];

    await Promise.all(rejectCases.map(el => {
      return rejects(async () => new Promise((resolve, reject) => {
        eventAwaiter.setupListener(el.key).then(resolve).catch(reject);
        setTimeout(() => eventAwaiter.dispatchEvent(el.key, el.payload), el.timeout);
      }));
    }));
  });

  test("wrong cases", async () => {
    const eventAwaiter = getEventAwaiter({ timeout: 1000 });

    const wrongCases = [
      { key, payload: true, timeout: 400, output: false } // true !== false
    ];

    await Promise.all(wrongCases.map(async el => {
      const val = await new Promise((resolve, reject) => {
        eventAwaiter.setupListener(el.key).then((v) => resolve(v)).catch(reject);
        setTimeout(() => eventAwaiter.dispatchEvent(el.key, el.payload), el.timeout);
      });
      notStrictEqual(val, el.output);
    }));
  });

  test("success cases", async () => {
    const eventAwaiter = getEventAwaiter({ timeout: 1000 });

    const successCases = [
      { key, payload: 1, timeout: 500, output: 1 }, // 1 === 1
      { key: key.repeat(2), payload: false, timeout: 200, output: false } // false === false
    ];

    await Promise.all(successCases.map(async el => {
      const val = await new Promise((resolve, reject) => {
        eventAwaiter.setupListener(el.key).then((v) => resolve(v)).catch(reject);
        setTimeout(() => eventAwaiter.dispatchEvent(el.key, el.payload), el.timeout);
      });
      strictEqual(val, el.output);
    }));
  });

});
