export interface IConfig {
  timeout?: number;
}

export interface IEventAwaiter {
  setupListener<T = any>(key: string): Promise<T>;
  dispatchEvent(key: string, payload: any): void;
}
