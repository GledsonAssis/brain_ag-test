import "./config/module-alias";
import "./config/env";
import { Registry } from "@/infra/di/di";
import { PostgresAdapter } from "@/infra/database/pg-adapter";
import { ExpressAdapter } from "@/infra/http/express-adapter";
import { Logger } from "@/infra/logger";
import { setupRoutes } from "@/infra/server/config/routes";
import env from "@/infra/server/config/env";
import SetupMiddlewares from "@/infra/server/config/middlewares";

async function main() {
  const httpServer = new ExpressAdapter();
  const pgConnection = new PostgresAdapter(env.pgUrl);
  Registry.getInstance().provide("logger", Logger);
  Registry.getInstance().provide("httpServer", httpServer);
  Registry.getInstance().provide("databaseConnection", pgConnection);
  await pgConnection.connect();
  new SetupMiddlewares();
  setupRoutes();
  httpServer.listen(env.port);
}

main();
