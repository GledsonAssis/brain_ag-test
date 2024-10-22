import { inject } from "@/infra/di/di";
import HttpServer from "@/infra/http/http-server";
import { adaptRoute } from "@/infra/server/adapters";
import { makeGetDashboardController } from "@/infra/server/factories/controllers/get-dashboard-controller";

export default class UserController {
  @inject("httpServer")
  httpServer?: HttpServer;

  constructor() {
    this.httpServer?.register(
      "get",
      "/dashboard/totals",
      adaptRoute(makeGetDashboardController())
    );
  }
}
