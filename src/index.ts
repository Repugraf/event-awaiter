import type { IEventAwaiter as IEventAwaiter, IConfig } from "./types";
import { createBrowserEventAwaiter } from "./awaiters/browserEventAwaiter";
import { createNodeEventAwaiter } from "./awaiters/nodeEventAwaiter";

export const getEventAwaiter = (config: IConfig = {}): IEventAwaiter => {
  if (typeof window !== "undefined" && typeof window.document !== "undefined")
    return createBrowserEventAwaiter(config);

  else if (typeof process !== "undefined" && process?.versions?.node)
    return createNodeEventAwaiter(config);

  throw new Error("Unsupported js environment");
};

export default getEventAwaiter;
