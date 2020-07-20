import type { IEventAwaiter, IConfig } from "../helpers/types";

export class BrowserEventAwaiter implements IEventAwaiter {
  private keys = {};
  // @ts-ignore
  private eventTarget = new EventTarget();
  constructor(private config: IConfig = {}) { }

  setupListener = (key: string): Promise<any> => {
    if (key in this.keys) throw new Error(`key (${key}) already in use`);

    return new Promise((resolve, reject) => {

      const timeOut = setTimeout(() => {
        reject(`event (${key}) timeout`);
      }, this.config.timeout || 20000);

      this.eventTarget.addEventListener(key, () => {
        clearTimeout(timeOut);
        this.eventTarget.removeEventListener(key, () => { });
        const data = this.keys[key];
        delete this.keys[key];
        resolve(data);
      });

    });
  }

  dispatchEvent = (key: string, payload: any = true): void => {
    this.keys[key] = payload;
    // @ts-ignore
    this.eventTarget.dispatchEvent(new Event(key));
  }

}
