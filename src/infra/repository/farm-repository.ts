import CustomError, { ErrorCodes } from "@/domain/entity/error";
import { inject } from "@/infra/di/di";
import Farm, { IFarm } from "@/domain/entity/farm";
import { ILogger } from "@/infra/logger";
import DatabaseConnection from "@/infra/database/database-connection";

export default interface FarmRepository {
  save(farm: Farm): Promise<Farm>;
  saveMany(farm: Farm[]): Promise<Farm[]>;
  findByProducer(id_producer: string): Promise<Farm[]>;
  updateMany(farms: Farm[]): Promise<Farm[]>;
  findById(id: string): Promise<Farm>;
  deleteByProducerId(id: string): Promise<void>;
  getDashboard(): Promise<any[]>;
}

export class FarmRepositoryDatabase implements FarmRepository {
  @inject("databaseConnection")
  connection?: DatabaseConnection;
  @inject("logger")
  Logger!: ILogger;

  async getDashboard(): Promise<any[]> {
    this.Logger.DEBUG("getDashboardFarm");
    const response = await this.connection?.query(
      `WITH total_farms AS (
          SELECT COUNT(*) AS total_farms_count
          FROM farms
      ),
      total_area AS (
          SELECT SUM(total_area_hectares) AS total_area_hectares
          FROM farms
      ),
      farms_by_state AS (
          SELECT state, COUNT(*) AS farm_count_by_state
          FROM farms
          GROUP BY state
      ),
      farms_by_crop AS (
          SELECT c.name AS crop_name, COUNT(fc.id_crop) AS farm_count_by_crop
          FROM farms_crops_relationship fc
          JOIN crops c ON fc.id_crop = c.id
          GROUP BY c.name
      ),
      land_usage AS (
          SELECT 
              SUM(arable_area_hectares) AS total_arable_area,
              SUM(vegetation_area_hectares) AS total_vegetation_area
          FROM farms
      )
      SELECT 
          (SELECT total_farms_count FROM total_farms) AS total_farms,
          (SELECT total_area_hectares FROM total_area) AS total_farms_area_hectares,

          (SELECT json_agg(
              json_build_object(
                  'state', state, 
                  'farm_count', farm_count_by_state
              )
          ) FROM farms_by_state) AS farms_by_state,

          (SELECT json_agg(
              json_build_object(
                  'crop', crop_name, 
                  'farm_count', farm_count_by_crop
              )
          ) FROM farms_by_crop) AS farms_by_crop,

          (SELECT total_arable_area FROM land_usage) AS total_arable_area,
          (SELECT total_vegetation_area FROM land_usage) AS total_vegetation_area;`
    );
    return response?.rows[0] ?? {};
  }

  async save(farm: Farm): Promise<Farm> {
    this.Logger.DEBUG("saveFarm", farm);
    const response = await this.connection?.query(
      "INSERT INTO farms (name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer) values ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer;",
      [
        farm.getName(),
        farm.getCity(),
        farm.getState(),
        farm.getTotalAreaHectares(),
        farm.getArableAreaHectares(),
        farm.getVegetationAreaHectares(),
        farm.getIdProducer(),
      ]
    );
    if (!response?.rows?.length)
      throw new CustomError({
        code: ErrorCodes.UNPROCESSABLE_ENTITY,
        title: "Error inserinting farm",
      });
    const newFarm = new Farm(response.rows[0]);
    return newFarm;
  }

  async deleteByProducerId(idProducer: string): Promise<void> {
    this.Logger.DEBUG("deleteByProducerId", { idProducer });

    if (!idProducer) {
      throw new CustomError({
        code: ErrorCodes.INVALID_PARAMS,
        title: "No producer ID provided for deletion",
      });
    }

    try {
      await this.connection?.query("BEGIN");
      const deleteRelationshipsQuery = `
        DELETE FROM farms_crops_relationship
        WHERE id_farm IN (
          SELECT id FROM farms WHERE id_producer = $1
        );
      `;
      await this.connection?.query(deleteRelationshipsQuery, [idProducer]);
      const deleteFarmsQuery = `
        DELETE FROM farms
        WHERE id_producer = $1;
      `;
      const deleteFarmsResponse = await this.connection?.query(
        deleteFarmsQuery,
        [idProducer]
      );
      if (!deleteFarmsResponse.rowCount) {
        throw new CustomError({
          code: ErrorCodes.UNPROCESSABLE_ENTITY,
          title: "No farms found for the provided producer ID",
        });
      }
      await this.connection?.query("COMMIT");

      this.Logger.INFO(
        `Farms deleted successfully for producer ID: ${idProducer}`
      );
    } catch (error) {
      await this.connection?.query("ROLLBACK");
      this.Logger.ERROR("Error in deleteByProducerId transaction: ", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError({
        code: ErrorCodes.UNPROCESSABLE_ENTITY,
        title: "Error deleting farms for producer",
      });
    }
  }

  async saveMany(farms: Farm[]): Promise<Farm[]> {
    this.Logger.DEBUG("saveManyFarms", farms);

    if (farms.length === 0) {
      throw new CustomError({
        code: ErrorCodes.INVALID_PARAMS,
        title: "No farms provided for insertion",
      });
    }

    try {
      await this.connection?.query("BEGIN");
      const farmValues = farms
        .map(
          (_farm, index) =>
            `($${index * 7 + 1}, $${index * 7 + 2}, $${index * 7 + 3}, $${
              index * 7 + 4
            }, $${index * 7 + 5}, $${index * 7 + 6}, $${index * 7 + 7})`
        )
        .join(", ");
      const farmInsertQuery = `
        INSERT INTO farms (name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer)
        VALUES ${farmValues}
        RETURNING id, name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer;
      `;
      const farmQueryParams: any[] = [];
      farms.forEach((farm) => {
        farmQueryParams.push(
          farm.getName(),
          farm.getCity(),
          farm.getState(),
          farm.getTotalAreaHectares(),
          farm.getArableAreaHectares(),
          farm.getVegetationAreaHectares(),
          farm.getIdProducer()
        );
      });
      const farmResponse = await this.connection?.query(
        farmInsertQuery,
        farmQueryParams
      );
      if (!farmResponse?.rows?.length) {
        throw new CustomError({
          code: ErrorCodes.UNPROCESSABLE_ENTITY,
          title: "Error inserting farms",
        });
      }
      const relationshipValues = farms
        .map((farm, index) => {
          return farm
            .getCrops()
            .map((crop) => `(${farmResponse.rows[index].id}, ${crop.getId()})`)
            .join(", ");
        })
        .join(", ");
      if (relationshipValues) {
        const relationshipInsertQuery = `
          INSERT INTO farms_crops_relationship (id_farm, id_crop)
          VALUES ${relationshipValues};
        `;
        await this.connection?.query(relationshipInsertQuery);
      }
      await this.connection?.query("COMMIT");
      const idProducer = farms[0].getIdProducer();
      const selectFarmsQuery = `
            SELECT f.*, c.name AS "crop.name", c.id AS "crop.id"
            FROM farms f
            LEFT JOIN farms_crops_relationship fc ON f.id = fc.id_farm
            LEFT JOIN crops c ON fc.id_crop = c.id
            WHERE f.id_producer = $1
            ORDER BY f.id;
        `;
      const allFarmsResponse = await this.connection?.query(selectFarmsQuery, [
        idProducer,
      ]);
      return this.groupByFarmId(allFarmsResponse.rows);
    } catch (error) {
      await this.connection?.query("ROLLBACK");
      this.Logger.ERROR("Error in saveMany transaction: ", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError({
        code: ErrorCodes.UNPROCESSABLE_ENTITY,
        title: "No Mapped Error",
      });
    }
  }

  async updateMany(farms: Farm[]): Promise<Farm[]> {
    this.Logger.DEBUG("updateManyFarms", farms);

    if (farms.length === 0) {
      throw new CustomError({
        code: ErrorCodes.INVALID_PARAMS,
        title: "No farms provided for update",
      });
    }

    try {
      await this.connection?.query("BEGIN");

      const farmValues = farms
        .map(
          (_farm, index) =>
            `($${index * 8 + 1}, $${index * 8 + 2}, $${index * 8 + 3}, $${
              index * 8 + 4
            }, $${index * 8 + 5}, $${index * 8 + 6}, $${index * 8 + 7}, $${
              index * 8 + 8
            })`
        )
        .join(", ");

      const farmUpdateQuery = `
        INSERT INTO farms (id, name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer)
        VALUES ${farmValues}
        ON CONFLICT (id)
        DO UPDATE SET
          name = EXCLUDED.name,
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          total_area_hectares = EXCLUDED.total_area_hectares,
          arable_area_hectares = EXCLUDED.arable_area_hectares,
          vegetation_area_hectares = EXCLUDED.vegetation_area_hectares
        RETURNING id, name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer;
      `;

      const farmQueryParams: any[] = [];
      farms.forEach((farm) => {
        farmQueryParams.push(
          farm.getId(),
          farm.getName(),
          farm.getCity(),
          farm.getState(),
          farm.getTotalAreaHectares(),
          farm.getArableAreaHectares(),
          farm.getVegetationAreaHectares(),
          farm.getIdProducer()
        );
      });

      const farmResponse = await this.connection?.query(
        farmUpdateQuery,
        farmQueryParams
      );

      if (!farmResponse?.rows?.length) {
        throw new CustomError({
          code: ErrorCodes.UNPROCESSABLE_ENTITY,
          title: "Error updating farms",
        });
      }

      const relationshipValues = farms
        .map((farm, index) => {
          return farm
            .getCrops()
            .map((crop) => `(${farmResponse.rows[index].id}, ${crop.getId()})`)
            .join(", ");
        })
        .join(", ");

      if (relationshipValues) {
        const deleteRelationshipQuery = `
          DELETE FROM farms_crops_relationship
          WHERE id_farm IN (${farms
            .map((farm) => `'${farm.getId()}'`)
            .join(", ")});
        `;
        await this.connection?.query(deleteRelationshipQuery);

        const relationshipInsertQuery = `
          INSERT INTO farms_crops_relationship (id_farm, id_crop)
          VALUES ${relationshipValues};
        `;
        await this.connection?.query(relationshipInsertQuery);
      }

      await this.connection?.query("COMMIT");

      const idProducer = farms[0].getIdProducer();
      const selectFarmsQuery = `
            SELECT f.*, c.name AS "crop.name", c.id AS "crop.id"
            FROM farms f
            LEFT JOIN farms_crops_relationship fc ON f.id = fc.id_farm
            LEFT JOIN crops c ON fc.id_crop = c.id
            WHERE f.id_producer = $1
            ORDER BY f.id;
        `;
      const allFarmsResponse = await this.connection?.query(selectFarmsQuery, [
        idProducer,
      ]);

      return this.groupByFarmId(allFarmsResponse.rows);
    } catch (error) {
      console.log(error);
      await this.connection?.query("ROLLBACK");
      this.Logger.ERROR("Error in updateMany transaction: ", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError({
        code: ErrorCodes.UNPROCESSABLE_ENTITY,
        title: "No Mapped Error",
      });
    }
  }

  async findByProducer(id_producer: string): Promise<Farm[]> {
    this.Logger.DEBUG("findByProducerFarm", id_producer);
    const selectFarmsQuery = `SELECT f.*, c.name AS "crop.name", c.id AS "crop.id"
            FROM farms f
            LEFT JOIN farms_crops_relationship fc ON f.id = fc.id_farm
            LEFT JOIN crops c ON fc.id_crop = c.id
            WHERE f.id_producer IN ($1)
            ORDER BY f.id;`;
    const allFarmsResponse = await this.connection?.query(selectFarmsQuery, [
      id_producer,
    ]);
    return this.groupByFarmId(allFarmsResponse.rows);
  }

  async findById(id: string): Promise<Farm> {
    this.Logger.DEBUG("findByIdFarm", id);
    const selectFarmsQuery = `SELECT f.*, c.name AS "crop.name", c.id AS "crop.id"
            FROM farms f
            LEFT JOIN farms_crops_relationship fc ON f.id = fc.id_farm
            LEFT JOIN crops c ON fc.id_crop = c.id
            WHERE f.id IN ($1)
            ORDER BY f.id;`;
    const allFarmsResponse = await this.connection?.query(selectFarmsQuery, [
      id,
    ]);
    return this.groupByFarmId(allFarmsResponse.rows)[0];
  }

  private groupByFarmId(
    allFarmsResponse: (IFarm & { "crop.name": string; "crop.id": string })[]
  ) {
    const groupedFarms = allFarmsResponse.reduce((acc, row) => {
      const existingFarm = acc.find(
        (farm: Farm) => farm.getId() === String(row.id)
      );
      if (existingFarm) {
        if (row["crop.id"]) {
          existingFarm.pushCrop({
            id: String(row["crop.id"]),
            name: row["crop.name"],
          });
        }
      } else {
        acc.push(
          new Farm({
            id: row.id,
            name: row.name,
            city: row.city,
            state: row.state,
            total_area_hectares: row.total_area_hectares,
            arable_area_hectares: row.arable_area_hectares,
            vegetation_area_hectares: row.vegetation_area_hectares,
            id_producer: row.id_producer,
            crops: row["crop.id"]
              ? [
                  {
                    id: String(row["crop.id"]),
                    name: row["crop.name"],
                  },
                ]
              : [],
          })
        );
      }
      return acc;
    }, [] as Farm[]);
    return groupedFarms;
  }
}
