export interface IConfig {
  timeout?: number;
}

export interface IEventAwaiter {
  setupListener(key: string): Promise<any>;
  dispatchEvent(key: string, payload: any): void;
}

