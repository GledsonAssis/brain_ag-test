import {WrapperLog} from '../types'
import * as Types from '../types'
import { getCallerFilePath } from '../utils/get-caller-file-path'
import * as path from 'path'
import WinstonMsg from './msg-log'

export default class WinstonAdapter implements Partial<WrapperLog> {
  setupOpt: Types.LoggerOptions | undefined
  filename = path.relative(process.cwd(), __filename)
  /* istanbul ignore next */
  DEBUG = (correlationId: string, message: string | Error, ...optionalParams: any[]): void =>
    WinstonMsg.msgLog(
      correlationId,
      Types.LevelsWinston.debug,
      path.relative(process.cwd(), getCallerFilePath(this.filename)),
      { msg: message, meta: [...optionalParams] },
      this.setupOpt)
  /* istanbul ignore next */
  ERROR = (correlationId: string, message: string | Error, ...optionalParams: any[]): void =>
    WinstonMsg.msgLog(
      correlationId,
      Types.LevelsWinston.error,
      path.relative(process.cwd(), getCallerFilePath(this.filename)),
      { msg: message, meta: [...optionalParams] },
      this.setupOpt)
  /* istanbul ignore next */
  INFO = (correlationId: string, message: string | Error, ...optionalParams: any[]): void =>
    WinstonMsg.msgLog(
      correlationId,
      Types.LevelsWinston.info,
      path.relative(process.cwd(), getCallerFilePath(this.filename)),
      { msg: message, meta: [...optionalParams] },
      this.setupOpt)
  /* istanbul ignore next */
  WARN = (correlationId: string, message: string | Error, ...optionalParams: any[]): void =>
    WinstonMsg.msgLog(
      correlationId,
      Types.LevelsWinston.warn,
      path.relative(process.cwd(), getCallerFilePath(this.filename)),
      { msg: message, meta: [...optionalParams] },
      this.setupOpt)
}
