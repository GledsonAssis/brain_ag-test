export interface InputValidator {
  compile: (schema: any, data: any) => Promise<InputValidator.Response>;
}

export namespace InputValidator {
  export type Request = any;
  export type Response = { isValid: boolean; message: string };
}
