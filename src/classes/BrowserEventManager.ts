import type { IEventAwaiter, IConfig } from "../helpers/types";

export class BrowserEventAwaiter implements IEventAwaiter {
  private keys: { [key: string]: any } = {};
  // @ts-ignore
  private eventTarget = new EventTarget();
  constructor(private config: IConfig = {}) { }

  public setupListener = (key: string): Promise<any> => {
    if (key in this.keys) throw new Error(`key (${key}) already in use`);

    return new Promise((resolve, reject) => {
      this.keys[key] = null;

      const timeOut = setTimeout(() => {
        clearTimeout(timeOut);
        this.eventTarget.removeEventListener(key, () => { });
        reject(`event (${key}) timeout`);
      }, this.config.timeout ?? 20000);

      this.eventTarget.addEventListener(key, () => {
        clearTimeout(timeOut);
        this.eventTarget.removeEventListener(key, () => { });
        const data = this.keys[key];
        delete this.keys[key];
        resolve(data);
      });

    });
  }

  public dispatchEvent = (key: string, payload: any = true): void => {
    this.keys[key] = payload;
    // @ts-ignore
    this.eventTarget.dispatchEvent(new Event(key));
  }

}
