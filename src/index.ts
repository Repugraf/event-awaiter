import type { IEventAwaiter as IEventAwaiter, IConfig } from "./helpers/types";
import { BrowserEventAwaiter } from "./classes/BrowserEventManager";
import { NodeEventAwaiter } from "./classes/NodeEventManager";

export const getEventAwaiter = (config: IConfig = {}): IEventAwaiter => {
  // @ts-ignore
  if (typeof window !== "undefined" && typeof window.document !== "undefined")
    return new BrowserEventAwaiter(config);
  else if (typeof process !== "undefined" && process?.versions?.node)
    return new NodeEventAwaiter(config);
  throw new Error("Unsupported js environment");
};

export default getEventAwaiter;
