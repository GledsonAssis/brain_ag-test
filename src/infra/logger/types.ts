export namespace ColorsLevel {
    export const COLORS = {
        DEBUG: 'cyan',
        INFO: 'green',
        WARN: 'yellow',
        ERROR: ['bold', 'red'],
        EXCEPTION: ['redBG', 'white'],
    }
}

export enum Colors {
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",

    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",

    BgBlack = "\x1b[40m",
    BgRed = "\x1b[41m",
    BgGreen = "\x1b[42m",
    BgYellow = "\x1b[43m",
    BgBlue = "\x1b[44m",
    BgMagenta = "\x1b[45m",
    BgCyan = "\x1b[46m",
    BgWhite = "\x1b[47m"
}

export enum ColorsMethod {
    GET = "\x1b[32m",
    POST = "\x1b[33m",
    DELETE = "\x1b[31m",
    PUT = "\x1b[34m",
    PATCH = "\x1b[36m",
    COPY = "\x1b[35m"
}

export enum ColorsStatus {
    '1xx' = "\x1b[36m",
    '2xx' = "\x1b[32m",
    '3xx' = "\x1b[34m",
    '4xx' = "\x1b[33m",
    '5xx' = "\x1b[1m\x1b[31m"
}

export enum Levels {
    DEBUG = 'DEBUG',
    ERROR = 'ERROR',
    INFO = 'INFO',
    WARN = 'WARN',
}

export enum LevelsWinston {
    error = 'error',
    warn = 'warn',
    help = 'help',
    data = 'data',
    info = 'info',
    debug = 'debug',
    prompt = 'prompt',
    http = 'http',
    verbose = 'verbose',
    input = 'input',
    silly = 'silly',
}

export type LoggerOptions = {
    colorize: boolean,
    key: string
    showData?: boolean
    showMeta?: boolean
    correlationId?: string
    httpAnalytics?: boolean
    format?: any,
    formatLog?: string
}

export interface WrapperLog {
    loggerMiddleware(correlationId: string, options?: LoggerOptions): (req: any, res: any, next: () => void) => void
    DEBUG(correlationId: string, message: string | Error, ...optionalParams: any[]): void
    ERROR(correlationId: string, message: string | Error, ...optionalParams: any[]): void
    INFO(correlationId: string, message: string | Error, ...optionalParams: any[]): void
    WARN(correlationId: string, message: string | Error, ...optionalParams: any[]): void
}