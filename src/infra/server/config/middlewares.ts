import { bodyParser, newCors, logger, authorization, monitoringMiddleware } from '@/infra/server/middlewares'
import { inject } from "@/infra/di/di";
import HttpServer from "@/infra/http/http-server";

export default class SetupMiddlewares {
  @inject("httpServer")
  httpServer?: HttpServer;

  constructor() {
    this.httpServer?.use(monitoringMiddleware);
    this.httpServer?.use(bodyParser);
    this.httpServer?.use(newCors);
    this.httpServer?.use(logger);
    this.httpServer?.use(authorization);
  }
}
