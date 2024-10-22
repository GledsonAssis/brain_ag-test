import { CreateProducer } from "@/application/usecases/create-producer";
import Producer from "@/domain/entity/producer";
import Farm from "@/domain/entity/farm";
import CustomError, { ErrorCodes } from "@/domain/entity/error";
import ProducerRepository from "@/infra/repository/producer-repository";
import FarmRepository from "@/infra/repository/farm-repository";
import CropRepository from "@/infra/repository/crop-repository";

jest.mock("@/domain/entity/producer");
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
      getCrops: jest.fn().mockReturnValue(
        data.crops.map((item: string) => ({
          getId: jest.fn().mockReturnValue(item),
        }))
      ),
    };
  }) as jest.Mocked<Partial<Farm>>;
});
jest.mock("@/infra/repository/producer-repository");
jest.mock("@/infra/repository/farm-repository");
jest.mock("@/infra/repository/crop-repository");

describe("CreateProducer", () => {
  let useCase: CreateProducer;
  let mockProducerRepository: jest.Mocked<ProducerRepository>;
  let mockFarmRepository: jest.Mocked<FarmRepository>;
  let mockCropRepository: jest.Mocked<CropRepository>;

  beforeEach(() => {
    mockProducerRepository = {
      save: jest.fn(),
      upsert: jest.fn(),
    } as unknown as jest.Mocked<ProducerRepository>;
    mockFarmRepository = {
      save: jest.fn(),
      saveMany: jest.fn(),
    } as unknown as jest.Mocked<FarmRepository>;
    mockCropRepository = {
      find: jest.fn(),
    } as unknown as jest.Mocked<CropRepository>;

    useCase = new CreateProducer();
    useCase.producerRepository = mockProducerRepository;
    useCase.farmRepository = mockFarmRepository;
    useCase.cropRepository = mockCropRepository;
  });

  it("should create a producer and associate farms with valid crops", async () => {
    const mockProducer = new Producer({
      name: "John Doe",
      document: "123456789",
    });
    mockProducerRepository.upsert.mockResolvedValueOnce(mockProducer);
    jest.spyOn(mockProducer, "getId").mockReturnValue("producer-id");
    const mockFarm = new Farm({
      id: "farm-id",
      name: "Farm 1",
      city: "City",
      state: "State",
      total_area_hectares: 100,
      arable_area_hectares: 50,
      vegetation_area_hectares: 50,
      crops: [{ id: "crop-id", name: "crop-name" }],
    });
    mockFarmRepository.saveMany.mockResolvedValueOnce([mockFarm]);

    const mockCrop = { getId: jest.fn().mockReturnValue("crop-id") };
    mockCropRepository.find.mockResolvedValueOnce([mockCrop as any]);

    const input = {
      name: "John Doe",
      document: "123456789",
      farms: [
        {
          name: "Farm 1",
          city: "City",
          state: "State",
          total_area_hectares: 100,
          arable_area_hectares: 50,
          vegetation_area_hectares: 50,
          crops: ["crop-id"],
        },
      ],
    };

    const response = await useCase.execute(input);

    expect(mockProducerRepository.upsert).toHaveBeenCalledWith(
      expect.any(Producer)
    );
    expect(mockCropRepository.find).toHaveBeenCalledWith({ id: ["crop-id"] });
    expect(response.value).toEqual(mockProducer.responseProducer([mockFarm]));
  });

  it("should throw an error if any invalid crop id is provided", async () => {
    const mockProducer = new Producer({
      name: "John Doe",
      document: "123456789",
    });
    mockProducerRepository.upsert.mockResolvedValueOnce(mockProducer);
    jest.spyOn(mockProducer, "getId").mockReturnValue("producer-id");

    mockCropRepository.find.mockResolvedValueOnce([]);

    const input = {
      name: "John Doe",
      document: "123456789",
      farms: [
        {
          name: "Farm 1",
          city: "City",
          state: "State",
          total_area_hectares: 100,
          arable_area_hectares: 50,
          vegetation_area_hectares: 50,
          crops: ["invalid-crop-id"],
        },
      ],
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      new CustomError({
        code: ErrorCodes.INVALID_PARAMS,
        title: "Invalid crop_id: invalid-crop-id ",
      })
    );
  });
});
