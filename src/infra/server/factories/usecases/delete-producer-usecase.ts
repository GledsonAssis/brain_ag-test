import { DeleteProducer } from "@/application/usecases";
import { Registry } from "@/infra/di/di";
import { makeProducerRepository } from "@/infra/server/factories/repositories/producer-repositories";
import { makeFarmRepository } from "@/infra/server/factories/repositories/farm-repositories";

export const makeDeleteProducer = (): void => {
  makeProducerRepository();
  makeFarmRepository();
  Registry.getInstance().provide("deleteProducer", new DeleteProducer());
};
