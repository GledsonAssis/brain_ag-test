import { Pool } from "pg";
import { PostgresAdapter } from "@/infra/database/pg-adapter";

jest.mock("pg");

describe("PostgresAdapter", () => {
  let loggerMock: any;
  let adapter: PostgresAdapter;
  let poolMock: any;

  beforeEach(async () => {
    loggerMock = {
      INFO: jest.fn(),
      ERROR: jest.fn(),
    };
    adapter = new PostgresAdapter("postgres://url");
    (adapter as any).Logger = loggerMock;
    poolMock = {
      connect: jest.fn(),
      query: jest.fn(),
      end: jest.fn(),
    };
    (Pool as unknown as jest.Mock).mockImplementation(() => poolMock);
    await adapter.connect();
  });

  it("deve conectar ao banco de dados com sucesso", async () => {
    expect(adapter.connection).toBeTruthy();
    expect(loggerMock.INFO).toHaveBeenCalledWith(
      "✅ [Successfully] - Database Connection"
    );
  });

  it("deve logar erro se a conexão falhar", async () => {
    const error = new Error("Connection failed");
    (Pool as unknown as jest.Mock).mockImplementation(() => ({
      ...poolMock,
      connect: jest.fn(() => {
        throw error;
      }),
    }));
    const adapter = new PostgresAdapter("postgres://url");
    (adapter as any).Logger = loggerMock;
    await adapter.connect();
    expect(loggerMock.INFO).toHaveBeenCalledWith(
      "❌ [Unsuccessfully] - Database Connection:"
    );
    expect(loggerMock.ERROR).toHaveBeenCalledWith("Error", error);
  });

  it("deve executar uma query com sucesso", async () => {
    const resultMock = { rows: [{ id: 1, name: "test" }] };
    (Pool as unknown as jest.Mock).mockImplementation(() => ({
      ...poolMock,
      query: jest.fn(() => resultMock),
    }));
    const adapter = new PostgresAdapter("postgres://url");
    (adapter as any).Logger = loggerMock;
    await adapter.connect();
    const result = await adapter.query("SELECT * FROM users", []);
    expect(result).toEqual(resultMock);
  });

  it("deve logar erro ao executar uma query", async () => {
    const error = new Error("Query failed");
    (Pool as unknown as jest.Mock).mockImplementation(() => ({
      ...poolMock,
      query: jest.fn(() => {
        throw error;
      }),
    }));
    const adapter = new PostgresAdapter("postgres://url");
    (adapter as any).Logger = loggerMock;
    await adapter.connect();
    await expect(adapter.query("SELECT * FROM users", [])).rejects.toThrow(
      error
    );
    expect(loggerMock.ERROR).toHaveBeenCalledWith(
      "Error executing query:",
      error
    );
  });

  it("deve fechar a conexão com sucesso", async () => {
    await adapter.close();
    expect(loggerMock.INFO).toHaveBeenCalledWith("Closing connection MongoDB");
    expect(adapter.connection?.end).toHaveBeenCalled();
  });

  it("deve logar erro ao fechar a conexão", async () => {
    const error = new Error("Close failed");
    (Pool as unknown as jest.Mock).mockImplementation(() => ({
      ...poolMock,
      end: jest.fn(() => {
        throw error;
      }),
    }));
    const adapter = new PostgresAdapter("postgres://url");
    (adapter as any).Logger = loggerMock;
    await adapter.connect();
    await adapter.close();
    expect(loggerMock.ERROR).toHaveBeenCalledWith(
      "Error closing the connection:",
      error
    );
  });
});
