import CustomError, { ErrorCodes } from "@/domain/entity/error";
import { inject } from "@/infra/di/di";
import Crop, { ICrop } from "@/domain/entity/crop";
import { ILogger } from "@/infra/logger";
import DatabaseConnection from "@/infra/database/database-connection";

type Enhanced<T> = {
  [K in keyof T]: T[K] extends string ? string | string[] : T[K];
};

type IEnhancedCrop = Enhanced<Required<ICrop>>;

export default interface CropRepository {
  find(crop: Partial<IEnhancedCrop>): Promise<Crop[]>;
}

export class CropRepositoryDatabase implements CropRepository {
  @inject("databaseConnection")
  connection?: DatabaseConnection;
  @inject("logger")
  Logger!: ILogger;

  async find(crop: Partial<IEnhancedCrop>): Promise<Crop[]> {
    this.Logger.DEBUG("findCrop", crop);
    if (!crop.id && !crop.name) {
      throw new CustomError({
        code: ErrorCodes.INVALID_PARAMS,
        title: "At least one of 'id' or 'name' must be provided.",
      });
    }
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;
    if (crop.id) {
      if (Array.isArray(crop.id)) {
        conditions.push(`id = ANY($${paramIndex++})`);
        params.push(crop.id);
      } else {
        conditions.push(`id = $${paramIndex++}`);
        params.push(crop.id);
      }
    }
    if (crop.name) {
      if (Array.isArray(crop.name)) {
        conditions.push(`name = ANY($${paramIndex++})`);
        params.push(crop.name);
      } else {
        conditions.push(`name = $${paramIndex++}`);
        params.push(crop.name);
      }
    }
    const query = `SELECT * FROM crops WHERE ${conditions.join(" AND ")}`;
    const response = await this.connection?.query(query, params);
    if (!response?.rows?.length) {
      throw new CustomError({
        code: ErrorCodes.UNPROCESSABLE_ENTITY,
        title: "No crops found with the given criteria.",
      });
    }
    const newCrops = response.rows.map((crop: ICrop) => new Crop(crop));
    return newCrops;
  }
}
