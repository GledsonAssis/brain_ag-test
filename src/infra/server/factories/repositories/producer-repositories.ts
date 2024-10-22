import { ProducerRepositoryDatabase } from "@/infra/repository/producer-repository";
import { Registry } from "@/infra/di/di";

export const makeProducerRepository = (): void => {
  Registry.getInstance().provide(
    "producerRepository",
    new ProducerRepositoryDatabase()
  );
};
