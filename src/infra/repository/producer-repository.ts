import CustomError, { ErrorCodes } from "@/domain/entity/error";
import { inject } from "@/infra/di/di";
import Producer from "@/domain/entity/producer";
import { ILogger } from "@/infra/logger";
import DatabaseConnection from "@/infra/database/database-connection";

export default interface ProducerRepository {
  save(producer: Producer): Promise<Producer>;
  upsert(producer: Producer): Promise<Producer>;
  update(id: string, producer: Partial<Producer>): Promise<Producer>;
  findById(id: string): Promise<Producer>;
  deleteById(id: string): Promise<void>;
}

export class ProducerRepositoryDatabase implements ProducerRepository {
  @inject("databaseConnection")
  connection?: DatabaseConnection;
  @inject("logger")
  Logger!: ILogger;

  async save(producer: Producer): Promise<Producer> {
    this.Logger.DEBUG("saveProducer", producer);
    const response = await this.connection?.query(
      "INSERT INTO producers (name, document) values ($1, $2) RETURNING id, name, document, is_active;",
      [producer.getName(), producer.getDocument()]
    );
    if (!response?.rows?.length)
      throw new CustomError({
        code: ErrorCodes.UNPROCESSABLE_ENTITY,
        title: "Error inserinting producer",
      });
    const newProducer = new Producer(response.rows[0]);
    return newProducer;
  }

  async update(id: string, producer: Partial<Producer>): Promise<Producer> {
    this.Logger.DEBUG("updateProducer", { id, ...producer });

    const query = `UPDATE producers
      SET 
        name = COALESCE($2, name),
        document = COALESCE($3, document),
        is_active = COALESCE($4, is_active)
      WHERE id = $1
      RETURNING id, name, document, is_active;`;

    const response = await this.connection?.query(query, [
      id,
      producer.getName?.() || null,
      producer.getDocument?.() || null,
      producer.getIsActive?.() !== undefined ? producer.getIsActive() : null,
    ]);

    if (!response?.rows?.length) {
      throw new CustomError({
        code: ErrorCodes.UNPROCESSABLE_ENTITY,
        title: "Error updating producer",
      });
    }

    const updatedProducer = new Producer(response.rows[0]);
    return updatedProducer;
  }

  async upsert(producer: Producer): Promise<Producer> {
    this.Logger.DEBUG("upsertProducer", producer);
    const response = await this.connection?.query(
      `INSERT INTO producers (name, document)
       VALUES ($1, $2)
       ON CONFLICT (document) 
       DO UPDATE SET 
         name = EXCLUDED.name,
         is_active = EXCLUDED.is_active
       RETURNING id, name, document, is_active;`,
      [producer.getName(), producer.getDocument()]
    );
    if (!response?.rows?.length) {
      throw new CustomError({
        code: ErrorCodes.UNPROCESSABLE_ENTITY,
        title: "Error inserting/updating producer",
      });
    }
    const newProducer = new Producer(response.rows[0]);
    return newProducer;
  }

  async findById(id: string): Promise<Producer> {
    this.Logger.DEBUG("findProducer", id);
    const query = `SELECT * FROM producers WHERE ID = $1;`;
    const response = await this.connection?.query(query, [id]);
    if (!response?.rows?.length) {
      throw new CustomError({
        code: ErrorCodes.NOT_FOUND,
        title: "No producers found.",
      });
    }
    return new Producer(response.rows[0]);
  }
  
  async deleteById(id: string): Promise<void> {
    this.Logger.DEBUG("deleteByIdProducer", id);
    const query = `DELETE FROM producers WHERE ID = $1;`;
    await this.connection?.query(query, [id]);
  }
}
