import * as Types from "../types";
import winston from "winston";
import { randomUUID } from "crypto";

export default class WinstonMsg {
  static readonly msgLog = (
    correlationId: string,
    level: Types.LevelsWinston,
    pathParent: string,
    props: { msg: string | Error; meta?: any; callback?: Function },
    options?: Types.LoggerOptions
  ) => {
    const winstonClass = new WinstonMsg();
    let error: Error | undefined;
    if (props.msg instanceof Error) error = props.msg;
    else if (props.meta.some((item: any) => item instanceof Error)) {
      error = props.meta.find((item: any) => item instanceof Error);
    }
    const DATE = new Date();
    const MSG_LOG = {
      type: "MSG_LOG",
      requestId: correlationId,
      correlationId: randomUUID(),
      date: DATE.toISOString(),
      level: level,
      message: error || props.msg,
      objects: props.meta,
      stackTrace: error?.stack ?? "",
      className: pathParent,
      msgError: props.msg,
      ...options?.format,
    };
    const logger = winston.createLogger({
      level: process.env.APP_ENV === "dev" ? "debug" : "info",
      format: winston.format.combine(
        winston.format((info) => {
          info.level = info.level.toUpperCase();
          return info;
        })(),
        winstonClass.enumerateErrorFormat(),
        process.env.APP_ENV === "dev"
          ? winston.format.colorize()
          : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message, correlationId, date }) => {
          const parsedLevel = `[${level}]`;
          const parsedDate = `${Types.Colors.Dim}${date}${Types.Colors.Reset}`;
          const parsedInstanceId = `${Types.Colors.Dim}[${correlationId}]${Types.Colors.Reset}`
          const parsedMessage = `${message}`;
          return [
            parsedLevel,
            parsedDate,
            parsedInstanceId,
            parsedMessage,
          ].join(" - ");
        })
      ),
      transports: [
        new winston.transports.Console({
          stderrLevels: ["error"],
        }),
      ],
    });
    logger[level](MSG_LOG);
  };
  private readonly enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
      Object.assign(info, { message: info.stack });
    }
    return info;
  });
}
