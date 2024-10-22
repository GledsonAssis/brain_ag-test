import MorganAdapter from "./morgan/morgan-adapter";
import WinstonAdapter from "./winston/winston-adapter";
import { WrapperLog } from "./types";
import { randomUUID } from "crypto";

export namespace Logger {
  const showLog: boolean = process.env.NODE_ENV !== "test";
  export const adaptersMsg: Omit<WrapperLog, "loggerMiddleware"> =
    new WinstonAdapter();
  export const adaptersMiddleware: Pick<WrapperLog, "loggerMiddleware"> =
    new MorganAdapter();

  export const loggerMiddleware = (options?: any) =>
    showLog
      ? adaptersMiddleware.loggerMiddleware(randomUUID(), options)
      : (req: any, res: any, next: Function) => {
          req.headers.correlationId = req.headers.correlationId ?? randomUUID();
          req.headers.requestId = randomUUID();
          next();
        };
  export const DEBUG = (message: string | Error, ...args: any[]) =>
    showLog ? adaptersMsg.DEBUG(randomUUID(), message, ...args) : undefined;
  export const ERROR = (message: string | Error, ...args: any[]) =>
    showLog ? adaptersMsg.ERROR(randomUUID(), message, ...args) : undefined;
  export const INFO = (message: string | Error, ...args: any[]) =>
    showLog ? adaptersMsg.INFO(randomUUID(), message, ...args) : undefined;
  export const WARN = (message: string | Error, ...args: any[]) =>
    showLog ? adaptersMsg.WARN(randomUUID(), message, ...args) : undefined;
}

export type ILogger = {
  loggerMiddleware: (
    options?: any
  ) => (req: any, res: any, next: () => void) => void;
  WARN: (message: string | Error, ...args: any[]) => void;
  ERROR: (message: string | Error, ...args: any[]) => void;
  INFO: (message: string | Error, ...args: any[]) => void;
  DEBUG: (message: string | Error, ...args: any[]) => void;
};
