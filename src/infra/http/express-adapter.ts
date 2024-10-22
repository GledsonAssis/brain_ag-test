import express, { json, Express } from "express";
import HttpServer, { Version, Url } from "./http-server";
import { inject } from "@/infra/di/di";
import { ILogger } from "@/infra/logger";

export class ExpressAdapter implements HttpServer {
  app: Express;
  @inject("logger")
  Logger!: ILogger;

  constructor() {
    this.app = express();
  }

  use(func: Express): void {
    this.app.use(func);
  }

  register(
    method: "get" | "post" | "patch" | "put" | "delete",
    url: Url,
    callback: Function,
    version: Version = "v1"
  ): void {
    this.Logger.INFO(
      "✅ Registering route: " + method + " | " + `/${version}${url}`
    );
    this.app[method](`/${version}${url}`, async function (req: any, res: any) {
      try {
        return await callback(req, res);
      } catch (e: any) {
        res.status(422).json({ message: e.message });
      }
    });
  }

  listen(port: number): void {
    this.app
      .listen(port, () => {
        this.Logger.INFO("✅ [Successfully] - Server Startup - port: " + port);
      })
      .on("error", (err) => {
        this.Logger.INFO("❌ [Unsuccessfully] - Server Startup:");
        this.Logger.ERROR(err);
      });
  }
}
