export type Version = `v${number}`;
export type Url = `/${string}`;

export default interface HttpServer {
  register(
    method: string,
    url: Url,
    callback: Function,
    version?: Version,
  ): void;
  listen(port: number): void;
  use(func: Function): void;
}
