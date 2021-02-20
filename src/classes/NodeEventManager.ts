import type { IEventAwaiter, IConfig } from "../types";
import { EventEmitter } from "events";

export class NodeEventAwaiter implements IEventAwaiter {
  private keys: { [key: string]: any } = {};
  private eventEmitter: EventEmitter;

  constructor(private config: IConfig = {}) {
    this.eventEmitter = new EventEmitter();
  }

  public setupListener = (key: string): Promise<any> => {
    if (key in this.keys) throw new Error(`key (${key}) already in use`);
    this.keys[key] = null;

    return new Promise((resolve, reject) => {

      const timeOut = setTimeout(() => {
        clearTimeout(timeOut);
        this.eventEmitter.removeAllListeners(key);
        delete this.keys[key];
        reject(`event (${key}) timeout`);
      }, this.config.timeout ?? 20000);

      this.eventEmitter.once(key, (payload: any) => {
        clearTimeout(timeOut);
        this.eventEmitter.removeAllListeners(key);
        delete this.keys[key];
        resolve(payload);
      });
    });
  }

  public dispatchEvent = (key: string, payload: any = true) => this.eventEmitter.emit(key, payload);

}
