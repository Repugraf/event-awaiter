import type { IEventAwaiter, IConfig } from "../types";

export const createBrowserEventAwaiter = (config: IConfig = {}): IEventAwaiter => {
  const keys: { [key: string]: any } = {};
  const eventTarget = new EventTarget();

  const setupListener = (key: string): Promise<any> => {
    if (key in keys) throw new Error(`key (${key}) already in use`);

    return new Promise((resolve, reject) => {
      keys[key] = null;

      const timeOut = setTimeout(() => {
        clearTimeout(timeOut);
        eventTarget.removeEventListener(key, () => { });
        delete keys[key];
        reject(`event (${key}) timeout`);
      }, config.timeout ?? 20000);

      eventTarget.addEventListener(key, () => {
        clearTimeout(timeOut);
        eventTarget.removeEventListener(key, () => { });
        const data = keys[key];
        delete keys[key];
        resolve(data);
      });

    });
  };

  const dispatchEvent = (key: string, payload: any = true): void => {
    keys[key] = payload;
    eventTarget.dispatchEvent(new Event(key));
  };

  return {
    setupListener,
    dispatchEvent
  };

};
