import { UpdateProducerController, Controller } from "@/interfaces/controllers";
import { makeUpdateProducer } from "@/infra/server/factories/usecases";

export const makeUpdateProducerController = (): Controller => {
  makeUpdateProducer();
  return new UpdateProducerController();
};
