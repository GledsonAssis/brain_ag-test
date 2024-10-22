import { randomUUID } from "crypto";

interface ErrorInput {
  code: ErrorCodes;
  title?: string;
  requestId?: string;
  correlationId?: string;
  timestamp?: string;
}

const replacer = (obj: any) => (key: string, value: any) => {
  if (key !== "" && value === obj) return "[Circular]";
  return value;
};

export default class CustomError extends Error {
  code: string;
  statusCode: number;
  requestId?: string;
  timestamp: string;
  title: string;
  constructor(error: ErrorInput) {
    super();
    this.message = JSON.stringify(error, replacer(error));
    this.title = error.title ?? this.getEnumKeyByValue(error.code);
    this.code = this.getEnumKeyByValue(error.code);
    this.statusCode = error.code;
    this.requestId = error.requestId ?? randomUUID();
    this.timestamp = error.timestamp ?? new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }

  private getEnumKeyByValue(value: number): string {
    return (
      Object.keys(ErrorCodes).find(
        (key) => ErrorCodes[key as keyof typeof ErrorCodes] === value
      ) || "UNMAPPED_ERROR"
    );
  }
}

export enum ErrorCodes {
  UNMAPPED_ERROR = 500,
  UNPROCESSABLE_ENTITY = 422,
  INVALID_PARAMS = 400,
  INVALID_TOKEN = 401,
  NOT_FOUND = 404,
  LOGIN_ERROR = 401,
  SERVER_ERROR = 500,
}
