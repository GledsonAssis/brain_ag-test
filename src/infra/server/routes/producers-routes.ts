import { inject } from "@/infra/di/di";
import HttpServer from "@/infra/http/http-server";
import { adaptRoute } from "@/infra/server/adapters";
import { makeCreateProducerController } from "@/infra/server/factories/controllers/create-producer-controller";
import { makeUpdateProducerController } from "@/infra/server/factories/controllers/update-producer-controller";
import { makeDeleteProducerController } from "@/infra/server/factories/controllers/delete-producer-controller";

export default class UserController {
  @inject("httpServer")
  httpServer?: HttpServer;

  constructor() {
    this.httpServer?.register(
      "post",
      "/producers",
      adaptRoute(makeCreateProducerController())
    );
    this.httpServer?.register(
      "patch",
      "/producers/:id",
      adaptRoute(makeUpdateProducerController())
    );
    this.httpServer?.register(
      "delete",
      "/producers/:id",
      adaptRoute(makeDeleteProducerController())
    );
  }
}
