import { ProducerRepositoryDatabase } from "@/infra/repository/producer-repository";
import Producer from "@/domain/entity/producer";
import DatabaseConnection from "@/infra/database/database-connection";
import { ILogger } from "@/infra/logger";
import CustomError, { ErrorCodes } from "@/domain/entity/error";

jest.mock("@/domain/entity/producer", () => {
  return jest.fn().mockImplementation((data) => {
    return {
      getName: jest.fn().mockReturnValue(data.name),
      getDocument: jest.fn().mockReturnValue(data.document),
    };
  }) as jest.Mocked<Partial<Producer>>;
});

describe("ProducerRepositoryDatabase", () => {
  let repository: ProducerRepositoryDatabase;
  let mockConnection: jest.Mocked<DatabaseConnection>;
  let mockLogger: jest.Mocked<ILogger>;
  let mockProducer: jest.Mocked<Partial<Producer>>;

  beforeEach(() => {
    mockConnection = {
      query: jest.fn(),
      close: jest.fn(),
    };

    mockLogger = {
      DEBUG: jest.fn(),
      INFO: jest.fn(),
      ERROR: jest.fn(),
      WARN: jest.fn(),
      loggerMiddleware: jest.fn(),
    };

    mockProducer = {
      getName: jest.fn().mockReturnValue("Producer Test"),
      getDocument: jest.fn().mockReturnValue("123456789"),
    } as jest.Mocked<Partial<Producer>>;
    repository = new ProducerRepositoryDatabase();
    repository.connection = mockConnection;
    repository.Logger = mockLogger;
  });

  it("should successfully save a producer", async () => {
    const dbResponse = {
      rows: [
        {
          id: 1,
          name: "Producer Test",
          document: "123456789",
          is_active: true,
        },
      ],
    };
    mockConnection.query.mockResolvedValueOnce(dbResponse);
    const result = await repository.save(mockProducer as Producer);
    expect(mockConnection.query).toHaveBeenCalledWith(
      "INSERT INTO producers (name, document) values ($1, $2) RETURNING id, name, document, is_active;",
      [mockProducer.getName!(), mockProducer.getDocument!()]
    );
    expect(mockLogger.DEBUG).toHaveBeenCalledWith("saveProducer", mockProducer);
    expect(result.getDocument()).toBe("123456789");
    expect(result.getName()).toBe("Producer Test");
  });

  it("should throw CustomError if query returns no rows", async () => {
    mockConnection.query.mockResolvedValueOnce({ rows: [] });

    await expect(repository.save(mockProducer as Producer)).rejects.toThrow(
      new CustomError({
        code: ErrorCodes.UNPROCESSABLE_ENTITY,
        title: "Error inserinting producer",
      })
    );

    expect(mockLogger.DEBUG).toHaveBeenCalledWith("saveProducer", mockProducer);
    expect(mockConnection.query).toHaveBeenCalledWith(
      "INSERT INTO producers (name, document) values ($1, $2) RETURNING id, name, document, is_active;",
      [mockProducer.getName!(), mockProducer.getDocument!()]
    );
  });

  it("should throw an error if the database query fails", async () => {
    const dbError = new Error("Database error");
    mockConnection.query.mockRejectedValueOnce(dbError);

    await expect(repository.save(mockProducer as Producer)).rejects.toThrow(
      dbError
    );

    expect(mockLogger.DEBUG).toHaveBeenCalledWith("saveProducer", mockProducer);
    expect(mockConnection.query).toHaveBeenCalledWith(
      "INSERT INTO producers (name, document) values ($1, $2) RETURNING id, name, document, is_active;",
      [mockProducer.getName!(), mockProducer.getDocument!()]
    );
  });

  it("should successfully upsert a producer", async () => {
    const dbResponse = {
      rows: [
        {
          id: 1,
          name: "Producer Test",
          document: "123456789",
          is_active: true,
        },
      ],
    };
    mockConnection.query.mockResolvedValueOnce(dbResponse);
    const result = await repository.upsert(mockProducer as Producer);
    expect(mockConnection.query).toHaveBeenCalledWith(
      `INSERT INTO producers (name, document)
       VALUES ($1, $2)
       ON CONFLICT (document) 
       DO UPDATE SET 
         name = EXCLUDED.name,
         is_active = EXCLUDED.is_active
       RETURNING id, name, document, is_active;`,
      [mockProducer.getName!(), mockProducer.getDocument!()]
    );
    expect(mockLogger.DEBUG).toHaveBeenCalledWith(
      "upsertProducer",
      mockProducer
    );
    expect(result.getDocument()).toBe("123456789");
    expect(result.getName()).toBe("Producer Test");
  });

  it("should throw CustomError if query returns no rows on upsert", async () => {
    mockConnection.query.mockResolvedValueOnce({ rows: [] });

    await expect(repository.upsert(mockProducer as Producer)).rejects.toThrow(
      new CustomError({
        code: ErrorCodes.UNPROCESSABLE_ENTITY,
        title: "Error inserting/updating producer",
      })
    );

    expect(mockLogger.DEBUG).toHaveBeenCalledWith(
      "upsertProducer",
      mockProducer
    );
    expect(mockConnection.query).toHaveBeenCalledWith(
      `INSERT INTO producers (name, document)
       VALUES ($1, $2)
       ON CONFLICT (document) 
       DO UPDATE SET 
         name = EXCLUDED.name,
         is_active = EXCLUDED.is_active
       RETURNING id, name, document, is_active;`,
      [mockProducer.getName!(), mockProducer.getDocument!()]
    );
  });

  it("should throw an error if the database query fails on upsert", async () => {
    const dbError = new Error("Database error");
    mockConnection.query.mockRejectedValueOnce(dbError);

    await expect(repository.upsert(mockProducer as Producer)).rejects.toThrow(
      dbError
    );

    expect(mockLogger.DEBUG).toHaveBeenCalledWith(
      "upsertProducer",
      mockProducer
    );
    expect(mockConnection.query).toHaveBeenCalledWith(
      `INSERT INTO producers (name, document)
       VALUES ($1, $2)
       ON CONFLICT (document) 
       DO UPDATE SET 
         name = EXCLUDED.name,
         is_active = EXCLUDED.is_active
       RETURNING id, name, document, is_active;`,
      [mockProducer.getName!(), mockProducer.getDocument!()]
    );
  });

  it("should successfully update a producer", async () => {
    const dbResponse = {
      rows: [
        {
          id: 1,
          name: "Producer Test",
          document: "123456789",
          is_active: true,
        },
      ],
    };
    mockConnection.query.mockResolvedValueOnce(dbResponse);
    const getName = jest.fn().mockReturnValue("Producer Test");
    await repository.update("1", {
      getName,
    } as Partial<Producer>);
    expect(mockConnection.query).toHaveBeenCalledWith(
      `UPDATE producers
      SET 
        name = COALESCE($2, name),
        document = COALESCE($3, document),
        is_active = COALESCE($4, is_active)
      WHERE id = $1
      RETURNING id, name, document, is_active;`,
      ["1", getName(), null, null]
    );
    expect(mockLogger.DEBUG).toHaveBeenCalledWith("updateProducer", {
      id: "1",
      getName,
    });
  });
  it("should error update a producer", async () => {
    const dbResponse = {
      rows: [],
    };
    mockConnection.query.mockResolvedValueOnce(dbResponse);
    const getName = jest.fn().mockReturnValue("Producer Test");
    await expect(
      repository.update("1", {
        getName,
      } as Partial<Producer>)
    ).rejects.toThrow(
      new CustomError({
        code: ErrorCodes.UNPROCESSABLE_ENTITY,
        title: "Error updating producer",
      })
    );
    expect(mockConnection.query).toHaveBeenCalledWith(
      `UPDATE producers
      SET 
        name = COALESCE($2, name),
        document = COALESCE($3, document),
        is_active = COALESCE($4, is_active)
      WHERE id = $1
      RETURNING id, name, document, is_active;`,
      ["1", getName(), null, null]
    );
    expect(mockLogger.DEBUG).toHaveBeenCalledWith("updateProducer", {
      id: "1",
      getName,
    });
  });
  it("should successfully findById a producer", async () => {
    const dbResponse = {
      rows: [
        {
          id: 1,
          name: "Producer Test",
          document: "123456789",
          is_active: true,
        },
      ],
    };
    mockConnection.query.mockResolvedValueOnce(dbResponse);
    await repository.findById("1");
    expect(mockConnection.query).toHaveBeenCalledWith(
      `SELECT * FROM producers WHERE ID = $1;`,
      ["1"]
    );
    expect(mockLogger.DEBUG).toHaveBeenCalledWith("findProducer", "1");
  });
  it("should error find a producer", async () => {
    const dbResponse = {
      rows: [],
    };
    mockConnection.query.mockResolvedValueOnce(dbResponse);
    await expect(
      repository.findById("1")
    ).rejects.toThrow(
      new CustomError({
        code: ErrorCodes.NOT_FOUND,
        title: "No producers found.",
      })
    );
    expect(mockConnection.query).toHaveBeenCalledWith(
      `SELECT * FROM producers WHERE ID = $1;`,
      ["1"]
    );
    expect(mockLogger.DEBUG).toHaveBeenCalledWith("findProducer", "1");
  });
});
