import { CreateProducerController, Controller } from "@/interfaces/controllers";
import { makeCreateProducer } from "@/infra/server/factories/usecases";

export const makeCreateProducerController = (): Controller => {
  makeCreateProducer();
  return new CreateProducerController();
};
