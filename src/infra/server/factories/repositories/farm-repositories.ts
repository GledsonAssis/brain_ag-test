import { FarmRepositoryDatabase } from "@/infra/repository/farm-repository";
import { Registry } from "@/infra/di/di";

export const makeFarmRepository = (): void => {
  Registry.getInstance().provide(
    "farmRepository",
    new FarmRepositoryDatabase()
  );
};
