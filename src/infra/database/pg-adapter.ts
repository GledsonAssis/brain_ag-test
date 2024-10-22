import { Pool } from "pg";
import { inject } from "@/infra/di/di";
import { ILogger } from "@/infra/logger";
import DatabaseConnection from "@/infra/database/database-connection";

export class PostgresAdapter implements DatabaseConnection {
  connection: Pool | null = null;
  private readonly connectionString: string;
  @inject("logger")
  Logger!: ILogger;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  async connect() {
    try {
      this.connection = new Pool({
        connectionString: this.connectionString,
      });
      await this.connection.connect();
      this.Logger.INFO("✅ [Successfully] - Database Connection");
    } catch (error) {
      this.connection = null
      this.Logger.INFO("❌ [Unsuccessfully] - Database Connection:");
      this.Logger.ERROR("Error", error);
    }
  }

  async query(statement: string, params: any): Promise<any> {
    try {
      return this.connection?.query(statement, params);
    } catch (error) {
      this.Logger.ERROR("Error executing query:", error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.connection) {
      try {
        this.Logger.INFO("Closing connection MongoDB");
        await this.connection.end();
      } catch (error) {
        this.Logger.ERROR("Error closing the connection:", error);
      }
    }
  }
}
