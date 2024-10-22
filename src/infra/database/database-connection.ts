export default interface DatabaseConnection<T = any, S = any, P = any> {
  query(statement: S, params?: P): Promise<T>;
  close(): Promise<void>;
}
