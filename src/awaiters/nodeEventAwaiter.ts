import type { IEventAwaiter, IConfig } from "../types";
import { EventEmitter } from "events";

export const createNodeEventAwaiter = (config: IConfig = {}): IEventAwaiter => {
  const keys: { [key: string]: any } = {};
  const eventEmitter = new EventEmitter();

  const setupListener = (key: string): Promise<any> => {
    if (key in keys) throw new Error(`key (${key}) already in use`);
    keys[key] = null;

    return new Promise((resolve, reject) => {
      const timeOut = setTimeout(() => {
        clearTimeout(timeOut);
        eventEmitter.removeAllListeners(key);
        delete keys[key];
        reject(`event (${key}) timeout`);
      }, config.timeout ?? 20000);

      eventEmitter.once(key, (payload: any) => {
        clearTimeout(timeOut);
        eventEmitter.removeAllListeners(key);
        delete keys[key];
        resolve(payload);
      });
    });
  };

  const dispatchEvent = (key: string, payload: any = true) => {
    eventEmitter.emit(key, payload);
  };

  return {
    setupListener,
    dispatchEvent
  };
};
