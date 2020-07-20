import type { IEventAwaiter, IConfig } from "../helpers/types";

export class NodeEventAwaiter implements IEventAwaiter {
  private eventEmmiter;

  constructor(private config: IConfig = {}) {
    const { EventEmitter } = require("events");
    this.eventEmmiter = new EventEmitter();
  }

  public setupListener = (key: string): Promise<any> => {
    return new Promise((resolve, reject) => {

      const timeOut = setTimeout(() => {
        this.eventEmmiter.removeAllListeners(key);
        reject(`event (${key}) timeout`);
      }, this.config.timeout || 20000);

      this.eventEmmiter.once(key, (payload: any) => {
        clearTimeout(timeOut);
        this.eventEmmiter.removeAllListeners(key);
        resolve(payload);
      });
    });
  }

  public dispatchEvent = (key: string, payload: any = true) => this.eventEmmiter.emit(key, payload);

}