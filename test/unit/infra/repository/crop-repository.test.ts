import { CropRepositoryDatabase } from "@/infra/repository/crop-repository";
import Crop from "@/domain/entity/crop";
import DatabaseConnection from "@/infra/database/database-connection";
import { ILogger } from "@/infra/logger";
import CustomError, { ErrorCodes } from "@/domain/entity/error";

jest.mock("@/infra/database/database-connection");

describe("CropRepositoryDatabase", () => {
  let repository: CropRepositoryDatabase;
  let mockConnection: jest.Mocked<DatabaseConnection>;
  let mockLogger: jest.Mocked<ILogger>;

  beforeEach(() => {
    repository = new CropRepositoryDatabase();
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
    repository.connection = mockConnection;
    repository.Logger = mockLogger;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("find", () => {
    it("should return crops when valid id is provided", async () => {
      const mockCrops = [
        { id: "1", name: "Crop 1" },
        { id: "2", name: "Crop 2" },
      ];

      mockConnection.query.mockResolvedValueOnce({ rows: mockCrops });

      const result = await repository.find({ id: "1" });

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Crop);
      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM crops WHERE id = $1",
        ["1"]
      );
    });

    it("should return crops when array of ids is provided", async () => {
      const mockCrops = [
        { id: "1", name: "Crop 1" },
        { id: "2", name: "Crop 2" },
      ];

      mockConnection.query.mockResolvedValueOnce({ rows: mockCrops });

      const result = await repository.find({ id: ["1", "2"] });

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Crop);
      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM crops WHERE id = ANY($1)",
        [["1", "2"]]
      );
    });

    it("should return crops when valid name is provided", async () => {
      const mockCrops = [{ id: "1", name: "Crop 1" }];

      mockConnection.query.mockResolvedValueOnce({ rows: mockCrops });

      const result = await repository.find({ name: "Crop 1" });

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Crop);
      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM crops WHERE name = $1",
        ["Crop 1"]
      );
    });

    it("should throw an error if no id or name is provided", async () => {
      await expect(repository.find({})).rejects.toThrow(
        new CustomError({
          code: ErrorCodes.INVALID_PARAMS,
          title: "At least one of 'id' or 'name' must be provided.",
        })
      );
    });

    it("should throw an error if no crops are found", async () => {
      mockConnection.query.mockResolvedValueOnce({ rows: [] });

      await expect(repository.find({ id: "nonexistent-id" })).rejects.toThrow(
        new CustomError({
          code: ErrorCodes.UNPROCESSABLE_ENTITY,
          title: "No crops found with the given criteria.",
        })
      );
    });

    it("should handle an array of names", async () => {
      const mockCrops = [
        { id: "1", name: "Crop 1" },
        { id: "2", name: "Crop 2" },
      ];

      mockConnection.query.mockResolvedValueOnce({ rows: mockCrops });

      const result = await repository.find({ name: ["Crop 1", "Crop 2"] });

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Crop);
      expect(mockConnection.query).toHaveBeenCalledWith(
        "SELECT * FROM crops WHERE name = ANY($1)",
        [["Crop 1", "Crop 2"]]
      );
    });
  });
});
