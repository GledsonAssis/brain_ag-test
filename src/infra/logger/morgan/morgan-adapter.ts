import {
  Colors,
  ColorsMethod,
  ColorsStatus,
  LoggerOptions,
  WrapperLog,
} from "../types";
import * as path from "path";
import morgan from "morgan";
import { randomUUID } from "crypto";

export default class MorganAdapter implements Partial<WrapperLog> {
  setupOpt: LoggerOptions | undefined;
  constructor() {}
  filename = path.relative(process.cwd(), __filename);
  /* istanbul ignore next */
  loggerMiddleware = (instanceId: string, options: LoggerOptions) => {
    return morgan((tokens, req, res) => {
      const colorize = process.env.APP_ENV === "dev";
      const METHOD = tokens.method(req, res) as
        | "GET"
        | "POST"
        | "DELETE"
        | "PUT"
        | "PATCH"
        | "COPY";
      const STATUS = tokens.status(req, res);
      const DATE = new Date();
      const CONTENT_LENGTH = tokens.res(req, res, "content-length");
      const RESPONSE_TIME = tokens["response-time"](req, res);
      const HTTPSTATUSCOLOR = `${(STATUS || "500").charAt(0)}xx` as
        | "1xx"
        | "2xx"
        | "3xx"
        | "4xx"
        | "5xx";
      const PARSED_METHOD = colorize
        ? `${ColorsMethod[METHOD] || Colors.Reset}${METHOD}${Colors.Reset}`
        : METHOD;
      const PARSED_ID = colorize
        ? `${Colors.Dim}[${req.headers["x-correlation-id"]}]${Colors.Reset}`
        : req.headers["x-correlation-id"];
      const PARSED_URL = colorize
        ? `${Colors.Dim}${tokens.url(req, res)}${Colors.Reset}`
        : tokens.url(req, res);
      const PARSED_DATE = colorize
        ? `${Colors.Dim}${DATE.toISOString()}${Colors.Reset}`
        : DATE.toISOString();
      const PARSED_STATUS = colorize
        ? `${ColorsStatus[HTTPSTATUSCOLOR] || Colors.Reset}${STATUS}${
            Colors.Reset
          }`
        : STATUS;
      return [
        `[${PARSED_METHOD}]`,
        "-",
        PARSED_DATE,
        "-",
        `${PARSED_ID}`,
        "-",
        `${PARSED_URL}`,
        "-",
        `${PARSED_STATUS}`,
        "-",
        CONTENT_LENGTH,
        "bytes -",
        RESPONSE_TIME,
        "ms",
      ].join(" ");
    });
  };
}
