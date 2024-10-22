import { UpdateProducer } from "@/application/usecases";
import { Registry } from "@/infra/di/di";
import { makeProducerRepository } from "@/infra/server/factories/repositories/producer-repositories";
import { makeFarmRepository } from "@/infra/server/factories/repositories/farm-repositories";
import { makeCropRepository } from "@/infra/server/factories/repositories/crop-repositories";

export const makeUpdateProducer = (): void => {
  makeProducerRepository();
  makeFarmRepository();
  makeCropRepository();
  Registry.getInstance().provide("updateProducer", new UpdateProducer());
};
