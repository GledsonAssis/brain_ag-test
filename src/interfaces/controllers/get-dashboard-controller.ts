import { GetDashboard } from "@/application/usecases";
import {
  HttpRequest,
  HttpResponse,
  response,
} from "@/interfaces/presentations";
import { Controller } from "./controller";
import { Logger } from "@/infra/logger";
import { AJVCompile as InputValidator } from "@/infra/input-validator";
import { requestInputSchema } from "./schema/update-producer";
import { inject } from "@/infra/di/di";
import CustomError from "@/domain/entity/error";

export class GetDashboardController implements Controller {
  @inject("getDashboard")
  usecase!: GetDashboard;

  async handle(): Promise<HttpResponse> {
    try {
      const { error, value } = await this.usecase.execute();
      if (error && !value) {
        Logger.ERROR(`Business Rule Error: ${JSON.stringify(error)}`);
        return response({ error }, error.status || 400);
      }
      return response({ value }, 200);
    } catch (error: any) {
      if (error instanceof CustomError) {
        Logger.ERROR(String(error.code), error.message);
        return response(
          {
            error: {
              code: error.code,
              title: error.title,
              status: error.statusCode,
              detail: error.message || "No mapped error",
            },
          },
          error.statusCode
        );
      }
      Logger.ERROR(`Server Error: ${JSON.stringify(error.message)}`);
      return response(
        {
          error: {
            code: "UNPROCESSABLE_ENTITY",
            title: "Unprocessable Entity",
            status: 422,
            detail: JSON.stringify(error.message || "No mapped error"),
          },
        },
        422
      );
    }
  }
}
