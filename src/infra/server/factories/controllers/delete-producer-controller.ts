import { DeleteProducerController, Controller } from "@/interfaces/controllers";
import { makeDeleteProducer } from "@/infra/server/factories/usecases";

export const makeDeleteProducerController = (): Controller => {
  makeDeleteProducer();
  return new DeleteProducerController();
};
