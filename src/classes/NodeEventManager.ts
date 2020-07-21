import type { IEventAwaiter, IConfig } from "../helpers/types";
import { EventEmitter } from "events";

export class NodeEventAwaiter implements IEventAwaiter {
  private keys: { [key: string]: any } = {};
  private eventEmmiter: EventEmitter;

  constructor(private config: IConfig = {}) {
    this.eventEmmiter = new EventEmitter();
  }

  public setupListener = (key: string): Promise<any> => {
    if (key in this.keys) throw new Error(`key (${key}) already in use`);
    this.keys[key] = null;

    return new Promise((resolve, reject) => {

      const timeOut = setTimeout(() => {
        this.eventEmmiter.removeAllListeners(key);
        reject(`event (${key}) timeout`);
      }, this.config.timeout ?? 20000);

      this.eventEmmiter.once(key, (payload: any) => {
        clearTimeout(timeOut);
        this.eventEmmiter.removeAllListeners(key);
        delete this.keys[key];
        resolve(payload);
      });
    });
  }

  public dispatchEvent = (key: string, payload: any = true) => this.eventEmmiter.emit(key, payload);

}
