import { CropRepositoryDatabase } from "@/infra/repository/crop-repository";
import { Registry } from "@/infra/di/di";

export const makeCropRepository = (): void => {
  Registry.getInstance().provide(
    "cropRepository",
    new CropRepositoryDatabase()
  );
};
