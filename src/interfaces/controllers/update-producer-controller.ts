import { UpdateProducer } from "@/application/usecases";
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

export class UpdateProducerController implements Controller {
  @inject("updateProducer")
  usecase!: UpdateProducer;

  async handle({ body, params }: HttpRequest): Promise<HttpResponse> {
    try {
      const inputValidator = new InputValidator();
      const resultValidator = await inputValidator.compile(requestInputSchema, {
        ...body,
        ...params,
      });
      if (!resultValidator.isValid) {
        Logger.ERROR(`Input Schema Error: ${resultValidator.message}`);
        return response({ error: resultValidator.message }, 400);
      }
      const { error, value } = await this.usecase.execute(params.id, body);
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
