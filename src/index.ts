import type { IEventAwaiter as IEventAwaiter, IConfig } from "./types";
import { createBrowserEventAwaiter } from "./awaiters/browserEventAwaiter";
import { createNodeEventAwaiter } from "./awaiters/nodeEventAwaiter";

const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

const isWebWorker =
  typeof self === "object" &&
  self.constructor &&
  self.constructor.name === "DedicatedWorkerGlobalScope";

const isDeno = !!globalThis.Deno;

const isNode =
  typeof process !== "undefined" && process.versions != null && process.versions.node != null;

export const getEventAwaiter = (config: IConfig = {}): IEventAwaiter => {
  if (isBrowser || isWebWorker || isDeno) return createBrowserEventAwaiter(config);

  if (isNode) return createNodeEventAwaiter(config);

  throw new Error("Unsupported js environment");
};

export default getEventAwaiter;
