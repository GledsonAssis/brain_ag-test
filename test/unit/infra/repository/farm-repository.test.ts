import { FarmRepositoryDatabase } from "@/infra/repository/farm-repository";
import Farm from "@/domain/entity/farm";
import DatabaseConnection from "@/infra/database/database-connection";
import { ILogger } from "@/infra/logger";
import CustomError, { ErrorCodes } from "@/domain/entity/error";

jest.mock("@/domain/entity/farm", () => {
  return jest.fn().mockImplementation((data) => {
    return {
      getName: jest.fn().mockReturnValue(data.name),
      getCity: jest.fn().mockReturnValue(data.city),
      getState: jest.fn().mockReturnValue(data.state),
      getTotalAreaHectares: jest.fn().mockReturnValue(data.total_area_hectares),
      getArableAreaHectares: jest
        .fn()
        .mockReturnValue(data.arable_area_hectares),
      getVegetationAreaHectares: jest
        .fn()
        .mockReturnValue(data.vegetation_area_hectares),
      getIdProducer: jest.fn().mockReturnValue(data.id_producer),
      getId: jest.fn().mockReturnValue(data.id),
      getCrops: jest.fn().mockReturnValue({
        id: data["crop.id"],
        name: data["crop.name"],
      }),
    };
  }) as jest.Mocked<Partial<Farm>>;
});

describe("FarmRepositoryDatabase", () => {
  let repository: FarmRepositoryDatabase;
  let mockConnection: jest.Mocked<DatabaseConnection>;
  let mockLogger: jest.Mocked<ILogger>;
  let mockFarm: jest.Mocked<Partial<Farm>>;

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

    mockFarm = {
      getName: jest.fn().mockReturnValue("Farm Test"),
      getCity: jest.fn().mockReturnValue("Farm Test"),
      getState: jest.fn().mockReturnValue("Farm Test"),
      getTotalAreaHectares: jest.fn().mockReturnValue(100),
      getArableAreaHectares: jest.fn().mockReturnValue(100),
      getVegetationAreaHectares: jest.fn().mockReturnValue(100),
      getIdProducer: jest.fn().mockReturnValue("1"),
      getId: jest.fn().mockReturnValue("1"),
      getCrops: jest.fn().mockReturnValue([
        {
          getId: jest.fn().mockReturnValue("1"),
          getName: jest.fn().mockReturnValue("1"),
        },
        {
          getId: jest.fn().mockReturnValue("2"),
          getName: jest.fn().mockReturnValue("2"),
        },
      ]),
    } as jest.Mocked<Partial<Farm>>;
    repository = new FarmRepositoryDatabase();
    repository.connection = mockConnection;
    repository.Logger = mockLogger;
  });

  it("should successfully findByProducer a farm", async () => {
    const dbResponse = {
      rows: [
        {
          id: 1,
          name: "Farm Test",
          document: "123456789",
          is_active: true,
        },
      ],
    };
    mockConnection.query.mockResolvedValueOnce(dbResponse);
    await repository.findByProducer("1");
    expect(mockConnection.query).toHaveBeenCalledWith(
      `SELECT f.*, c.name AS "crop.name", c.id AS "crop.id"
            FROM farms f
            LEFT JOIN farms_crops_relationship fc ON f.id = fc.id_farm
            LEFT JOIN crops c ON fc.id_crop = c.id
            WHERE f.id_producer IN ($1)
            ORDER BY f.id;`,
      ["1"]
    );
    expect(mockLogger.DEBUG).toHaveBeenCalledWith("findByProducerFarm", "1");
  });
  it("should successfully findById a farm", async () => {
    const dbResponse = {
      rows: [
        {
          id: 1,
          name: "Farm Test",
          document: "123456789",
          is_active: true,
        },
      ],
    };
    mockConnection.query.mockResolvedValueOnce(dbResponse);
    await repository.findById("1");
    expect(mockConnection.query).toHaveBeenCalledWith(
      `SELECT f.*, c.name AS "crop.name", c.id AS "crop.id"
            FROM farms f
            LEFT JOIN farms_crops_relationship fc ON f.id = fc.id_farm
            LEFT JOIN crops c ON fc.id_crop = c.id
            WHERE f.id IN ($1)
            ORDER BY f.id;`,
      ["1"]
    );
    expect(mockLogger.DEBUG).toHaveBeenCalledWith("findByIdFarm", "1");
  });
  it("should successfully save a farm", async () => {
    const dbResponse = {
      rows: [
        {
          id: 1,
          name: "Farm Test",
          document: "123456789",
          is_active: true,
        },
      ],
    };
    mockConnection.query.mockResolvedValueOnce(dbResponse);
    const result = await repository.save(mockFarm as Farm);
    expect(mockConnection.query).toHaveBeenCalledWith(
      "INSERT INTO farms (name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer) values ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer;",
      [
        mockFarm.getName!(),
        mockFarm.getCity!(),
        mockFarm.getState!(),
        mockFarm.getTotalAreaHectares!(),
        mockFarm.getArableAreaHectares!(),
        mockFarm.getVegetationAreaHectares!(),
        mockFarm.getIdProducer!(),
      ]
    );
    expect(mockLogger.DEBUG).toHaveBeenCalledWith("saveFarm", mockFarm);
    expect(result.getName()).toBe("Farm Test");
  });

  it("should throw CustomError if query returns no rows", async () => {
    mockConnection.query.mockResolvedValueOnce({ rows: [] });

    await expect(repository.save(mockFarm as Farm)).rejects.toThrow(
      new CustomError({
        code: ErrorCodes.UNPROCESSABLE_ENTITY,
        title: "Error inserinting farm",
      })
    );

    expect(mockLogger.DEBUG).toHaveBeenCalledWith("saveFarm", mockFarm);
    expect(mockConnection.query).toHaveBeenCalledWith(
      "INSERT INTO farms (name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer) values ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer;",
      [
        mockFarm.getName!(),
        mockFarm.getCity!(),
        mockFarm.getState!(),
        mockFarm.getTotalAreaHectares!(),
        mockFarm.getArableAreaHectares!(),
        mockFarm.getVegetationAreaHectares!(),
        mockFarm.getIdProducer!(),
      ]
    );
  });

  it("should throw an error if the database query fails", async () => {
    const dbError = new Error("Database error");
    mockConnection.query.mockRejectedValueOnce(dbError);

    await expect(repository.save(mockFarm as Farm)).rejects.toThrow(dbError);

    expect(mockLogger.DEBUG).toHaveBeenCalledWith("saveFarm", mockFarm);
    expect(mockConnection.query).toHaveBeenCalledWith(
      "INSERT INTO farms (name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer) values ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer;",
      [
        mockFarm.getName!(),
        mockFarm.getCity!(),
        mockFarm.getState!(),
        mockFarm.getTotalAreaHectares!(),
        mockFarm.getArableAreaHectares!(),
        mockFarm.getVegetationAreaHectares!(),
        mockFarm.getIdProducer!(),
      ]
    );
  });

  it("should save multiple farms when valid data is provided", async () => {
    const farmDbResponse = {
      rows: [
        {
          id: 62,
          name: "fazenda Teste 6",
          city: "Cidade 1",
          state: "SC",
          total_area_hectares: "100.00",
          arable_area_hectares: "50.00",
          vegetation_area_hectares: "50.00",
          id_producer: 67,
        },
      ],
    };
    const selectFarmDbResponse = {
      rows: [
        {
          id: 62,
          name: "fazenda Teste 6",
          city: "Cidade 1",
          state: "SC",
          total_area_hectares: "100.00",
          arable_area_hectares: "50.00",
          vegetation_area_hectares: "50.00",
          id_producer: 67,
          "crop.name": "Soja",
          "crop.id": 1,
        },
        {
          id: 62,
          name: "fazenda Teste 6",
          city: "Cidade 1",
          state: "SC",
          total_area_hectares: "100.00",
          arable_area_hectares: "50.00",
          vegetation_area_hectares: "50.00",
          id_producer: 67,
          "crop.name": "Cana de Açucar",
          "crop.id": 5,
        },
      ],
    };
    mockConnection.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce(farmDbResponse)
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce(selectFarmDbResponse);
    const result = await repository.saveMany([mockFarm as Farm]);
    expect(mockLogger.DEBUG).toHaveBeenCalledWith("saveManyFarms", [
      mockFarm as Farm,
    ]);
    expect(mockConnection.query).toHaveBeenCalledWith(
      `
        INSERT INTO farms (name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, city, state, total_area_hectares, arable_area_hectares, vegetation_area_hectares, id_producer;
      `,
      [
        mockFarm.getName!(),
        mockFarm.getCity!(),
        mockFarm.getState!(),
        mockFarm.getTotalAreaHectares!(),
        mockFarm.getArableAreaHectares!(),
        mockFarm.getVegetationAreaHectares!(),
        mockFarm.getIdProducer!(),
      ]
    );
  });
  it("should error with no farm length", async () => {
    const error = new CustomError({
      code: ErrorCodes.INVALID_PARAMS,
      title: "No farms provided for insertion",
    });
    const farmDbResponse = {
      rows: [
        {
          id: 62,
          name: "fazenda Teste 6",
          city: "Cidade 1",
          state: "SC",
          total_area_hectares: "100.00",
          arable_area_hectares: "50.00",
          vegetation_area_hectares: "50.00",
          id_producer: 67,
        },
      ],
    };
    const selectFarmDbResponse = {
      rows: [
        {
          id: 62,
          name: "fazenda Teste 6",
          city: "Cidade 1",
          state: "SC",
          total_area_hectares: "100.00",
          arable_area_hectares: "50.00",
          vegetation_area_hectares: "50.00",
          id_producer: 67,
          "crop.name": "Soja",
          "crop.id": 1,
        },
        {
          id: 62,
          name: "fazenda Teste 6",
          city: "Cidade 1",
          state: "SC",
          total_area_hectares: "100.00",
          arable_area_hectares: "50.00",
          vegetation_area_hectares: "50.00",
          id_producer: 67,
          "crop.name": "Cana de Açucar",
          "crop.id": 5,
        },
      ],
    };
    mockConnection.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce(farmDbResponse)
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce(selectFarmDbResponse);

    await expect(repository.saveMany([])).rejects.toThrow(error);
    expect(mockLogger.DEBUG).toHaveBeenCalledWith("saveManyFarms", []);
  });
  it("should error mapped", async () => {
    const error = new CustomError({
      code: ErrorCodes.UNPROCESSABLE_ENTITY,
      title: "Error inserting farms",
    });
    const farmDbResponse = {
      rows: [],
    };
    const selectFarmDbResponse = {
      rows: [
        {
          id: 62,
          name: "fazenda Teste 6",
          city: "Cidade 1",
          state: "SC",
          total_area_hectares: "100.00",
          arable_area_hectares: "50.00",
          vegetation_area_hectares: "50.00",
          id_producer: 67,
          "crop.name": "Soja",
          "crop.id": 1,
        },
        {
          id: 62,
          name: "fazenda Teste 6",
          city: "Cidade 1",
          state: "SC",
          total_area_hectares: "100.00",
          arable_area_hectares: "50.00",
          vegetation_area_hectares: "50.00",
          id_producer: 67,
          "crop.name": "Cana de Açucar",
          "crop.id": 5,
        },
      ],
    };
    mockConnection.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce(farmDbResponse)
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce(selectFarmDbResponse);

    await expect(repository.saveMany([mockFarm as Farm])).rejects.toThrow(
      error
    );
    expect(mockLogger.DEBUG).toHaveBeenCalledWith("saveManyFarms", [mockFarm]);
    expect(mockConnection.query).toHaveBeenCalledWith("ROLLBACK");
  });
  it("should error no mapped", async () => {
    const selectFarmDbResponse = {
      rows: [
        {
          id: 62,
          name: "fazenda Teste 6",
          city: "Cidade 1",
          state: "SC",
          total_area_hectares: "100.00",
          arable_area_hectares: "50.00",
          vegetation_area_hectares: "50.00",
          id_producer: 67,
          "crop.name": "Soja",
          "crop.id": 1,
        },
        {
          id: 62,
          name: "fazenda Teste 6",
          city: "Cidade 1",
          state: "SC",
          total_area_hectares: "100.00",
          arable_area_hectares: "50.00",
          vegetation_area_hectares: "50.00",
          id_producer: 67,
          "crop.name": "Cana de Açucar",
          "crop.id": 5,
        },
      ],
    };
    mockConnection.query
      .mockRejectedValue(new Error("Generic Error"))
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce(selectFarmDbResponse);

    await expect(repository.saveMany([mockFarm as Farm])).rejects.toThrow();
    expect(mockLogger.DEBUG).toHaveBeenCalledWith("saveManyFarms", [mockFarm]);
  });
});
